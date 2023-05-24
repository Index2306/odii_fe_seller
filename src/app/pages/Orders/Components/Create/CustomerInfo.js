import React, { useState, useEffect, useCallback, memo } from 'react';
import { CustomerInfoWrapper } from '../../styles/OrderDetail';
import { isEmpty, debounce } from 'lodash';
import request from 'utils/request';
import { Form } from 'app/components';
import { Input, Select } from 'antd';
import userIcon from 'assets/images/icons/user.svg';
import {
  CREATE_CUSTOMER_TYPE,
  UPDATE_CUSTOMER_TYPE,
  SAVE_CUSTOMER_MODAL_KEY,
  SAVE_ADDRESS_MODAL_KEY,
} from '../../Features/Create';

const { Option } = Select;

const KEY_WORD_MIN_LENGTH = 2;

export default memo(function CustomerInfo({
  customerInfo,
  setCustomerInfo,
  shippingNote,
  setShippingNote,
  showSaveModal,
}) {
  const [listCustomer, setListCustomer] = useState([]);
  const [form] = Form.useForm();
  const [keyword, setKeyword] = useState(null);

  const hasCustomInfo = customerInfo?.id && true;

  useEffect(() => {
    // if (hasCustomInfo) {
    //   const currCustomerIndex = listCustomer.findIndex(
    //     customer => customer.id === customerInfo.id,
    //   );
    //   let listCustomerClone = [...listCustomer];
    //   if (currCustomerIndex === -1) {
    //     listCustomerClone = [customerInfo];
    //   } else {
    //     listCustomerClone[currCustomerIndex] = customerInfo;
    //   }

    //   setListCustomer(listCustomerClone);
    // }
    if (hasCustomInfo) {
      setListCustomer([]);
    }
  }, [customerInfo]);

  const getShippingAddress = (separator = ', ') => {
    const addressParts = [
      customerInfo?.address1,
      customerInfo?.ward_name,
      customerInfo?.district_name,
      customerInfo?.province_name,
    ].filter(address => address);
    return addressParts.join(separator);
  };

  const updateShippingNote = useCallback(
    debounce(note => {
      setShippingNote(note);
    }, 150),
    [],
  );

  const fetchCustomers = async keyword => {
    const response = await request(
      `user-service/admin/customers?keyword=${keyword}`,
      {
        method: 'get',
      },
    );
    if (response.is_success) {
      setListCustomer(response.data);
    }
  };

  const handleChange = value => {
    setCustomerInfo(listCustomer.find(customer => customer.id === value));
  };

  const handleSearch = useCallback(
    debounce(value => {
      setKeyword(value);
      if (value?.length < KEY_WORD_MIN_LENGTH) {
        setListCustomer([]);
        return;
      }
      fetchCustomers(value);
    }, 250),
  );

  return (
    <CustomerInfoWrapper className="box-df">
      <div className="customer-info__top flex-row">
        <div className="customer-top__title section-title">
          <span>Khách hàng</span>
        </div>
        <div
          className="customer-top__plus"
          onClick={() =>
            showSaveModal(SAVE_CUSTOMER_MODAL_KEY, CREATE_CUSTOMER_TYPE)
          }
        >
          <i className="fa fa-plus"></i>
          <span>Tạo mới</span>
        </div>
      </div>
      <div className="customer-top__search">
        <Form name="customer-filter" form={form}>
          <Form.Item
            name="keywordFilter"
            rules={[
              {
                min: KEY_WORD_MIN_LENGTH,
                message: `Nội dung tìm kiếm ít nhất ${KEY_WORD_MIN_LENGTH} kí tự`,
              },
            ]}
          >
            <Select
              showSearch
              className="customer-select"
              // placeholder={
              //   customerInfo?.full_name || 'Tìm kiếm khách hàng hiện có'
              // }
              placeholder="Tìm kiếm khách hàng hiện có"
              // defaultActiveFirstOption={false}
              value={null}
              showArrow={false}
              filterOption={false}
              onSearch={handleSearch}
              onChange={handleChange}
              notFoundContent={null}
            >
              {listCustomer.map(customer => (
                <Option key={customer.id} value={customer.id}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '2px 0',
                    }}
                  >
                    <img
                      alt="avatar"
                      src={userIcon}
                      className="customer-avatar"
                      style={{
                        background: '#6C798F',
                        width: '32px',
                        height: '32px',
                        borderRadius: '100%',
                      }}
                    ></img>
                    <div
                      className="customer-text"
                      style={{ marginLeft: '7px' }}
                    >
                      <div className="customer-name">{customer.full_name}</div>
                      <div
                        className="customer-email"
                        style={{
                          fontSize: '12px',
                          color: '#828282',
                          lineHeight: 1.2,
                        }}
                      >
                        {customer.email}
                      </div>
                    </div>
                  </div>
                </Option>
              ))}
            </Select>
            {/* {hasCustomInfo && (
              <div
                className="btn-update-customer"
                onClick={() =>
                  showSaveModal(SAVE_CUSTOMER_MODAL_KEY, UPDATE_CUSTOMER_TYPE)
                }
              >
                Sửa
              </div>
            )} */}
            {keyword && keyword.length < KEY_WORD_MIN_LENGTH && (
              <div className="ant-form-item-explain ant-form-item-explain-error">
                <div role="alert">Nội dung tìm kiếm ít nhất 2 kí tự</div>
              </div>
            )}
            {hasCustomInfo && (
              <div className="customer-name-wrapper">
                <div className="customer-name__value">
                  {customerInfo.full_name}
                </div>
                <div
                  className="btn-update-customer"
                  onClick={() =>
                    showSaveModal(SAVE_CUSTOMER_MODAL_KEY, UPDATE_CUSTOMER_TYPE)
                  }
                >
                  Sửa
                </div>
              </div>
            )}
          </Form.Item>
        </Form>
        {hasCustomInfo && (
          <div className="customer-info__center create-customer">
            <div className="customer-center__item center-item__two">
              <div>
                <div className="info-title">Email</div>
                <div className="customer-mail__value">{customerInfo.email}</div>
              </div>
              <div>
                <div className="info-title">Điện thoại</div>
                <div>{customerInfo.phone_number}</div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="customer-info__bottom">
        <div className="customer-bottom__title section-title">
          <span>Giao hàng</span>
          {hasCustomInfo && (
            <div
              className="shipping-address__plus"
              onClick={() => showSaveModal(SAVE_ADDRESS_MODAL_KEY)}
            >
              {/* <i className="fa fa-plus"></i> */}
              <span>Sửa</span>
            </div>
          )}
        </div>
        {!hasCustomInfo ? (
          <div className="address-plus border-df">
            {/* <i className="fa fa-plus"></i>
            <span>Thêm địa chỉ</span> */}
            <span>Chưa có thông tin giao hàng</span>
          </div>
        ) : (
          <div className="customer-bottom__content">
            <div className="bottom-content__item">
              <div>Địa chỉ</div>
              <div>{getShippingAddress()}</div>
            </div>
          </div>
        )}
        <div className="shipping-note">
          <div className="shipping-note__title">Ghi chú giao hàng</div>
          <div className="shipping-note__content">
            <Input
              className="shipping-note__input border-df"
              placeholder="Nhập nội dung ghi chú"
              defaultValue={shippingNote}
              onChange={e => updateShippingNote(e.target.value)}
            ></Input>
          </div>
        </div>
      </div>
    </CustomerInfoWrapper>
  );
});
