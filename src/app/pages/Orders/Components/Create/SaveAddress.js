import React, { useState, useEffect, useCallback, memo } from 'react';
import { Form, Input, Select, Button, Divider } from 'app/components';
import { Modal, Row, Col, Spin } from 'antd';
import { useTranslation } from 'react-i18next';

import {
  CREATE_CUSTOMER_TYPE,
  UPDATE_CUSTOMER_TYPE,
} from '../../Features/Create';
import { getLocation } from 'utils/providers';
import request from 'utils/request';
import { isEmpty, debounce } from 'lodash';

import styled from 'styled-components/macro';

const { Option } = Select;

const formItemLayout = {
  labelCol: {
    span: 24,
  },
};

const COUNTRY_VIET_NAM = {
  id: 240,
  name: 'Vietnam',
};

export default memo(function SaveAddress({
  customerInfo,
  setCustomerInfo,
  onCancel,
  onFinish,
  ...rest
}) {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const [isLoading, setLoading] = useState(false);
  const [isValidForm, setValidForm] = useState(false);
  const [listProvince, setListProvince] = useState([]);
  const [listDistrict, setListDistrict] = useState([]);
  const [listWard, setListWard] = useState([]);

  const isCreateNew = isEmpty(customerInfo);

  useEffect(() => {
    fetchListProvince();
  }, []);

  useEffect(() => {
    setdefaultValues();
  }, []);

  const updateValidForm = useCallback(
    debounce(() => {
      form
        .validateFields()
        .then(() => setValidForm(true))
        .catch(() => setValidForm(false));
    }, 200),
    [],
  );

  const setdefaultValues = async () => {
    if (!isCreateNew) {
      fetchListDistrict(customerInfo.province_id);
      fetchListWard(customerInfo.district_id);
      form.setFieldsValue({
        customer_province: {
          value: customerInfo.province_id,
          label: customerInfo.province_name,
        },
        customer_district: {
          value: customerInfo.district_id,
          label: customerInfo.district_name,
        },
        customer_ward: {
          value: customerInfo.ward_id,
          label: customerInfo.ward_name,
        },
        customer_street: customerInfo.address1,
      });
      setValidForm(true);
    }
  };

  const filterLocation = (input, option) => {
    return (
      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
    );
  };

  const fetchListProvince = () => {
    setLoading(true);
    getLocation({ type: 'province' }).then(res => {
      if (!isEmpty(res?.data)) setListProvince(res?.data);
      setLoading(false);
    });
  };

  const fetchListDistrict = province => {
    setLoading(true);
    getLocation({ parent_id: province, type: 'district' }).then(res => {
      if (!isEmpty(res?.data)) setListDistrict(res?.data);
      setLoading(false);
    });
  };

  const fetchListWard = province => {
    setLoading(true);
    getLocation({ parent_id: province, type: 'ward' }).then(res => {
      if (!isEmpty(res?.data)) setListWard(res?.data);
      setLoading(false);
    });
  };

  const saveAddress = async () => {
    const {
      customer_province,
      customer_district,
      customer_ward,
      customer_street,
    } = form.getFieldsValue(true);

    const data = {
      address1: customer_street,
      country_id: COUNTRY_VIET_NAM.id,
      country_name: COUNTRY_VIET_NAM.name,
      province_id: customer_province.value,
      province_name: customer_province.label,
      district_id: customer_district.value,
      district_name: customer_district.label,
      ward_id: customer_ward.value,
      ward_name: customer_ward.label,
    };

    setCustomerInfo({ ...customerInfo, ...data });
    onFinish();
  };

  return (
    <SaveAddressModal
      transitionName=""
      width={640}
      className="box-df"
      title={
        <>
          <div className="modal-title__main">
            <span>Cập nhật địa chỉ giao hàng</span>
          </div>
          <div className="modal-title__desc">
            Vui lòng nhập các thông tin dưới đây để lưu địa chỉ
          </div>
        </>
      }
      footer={null}
      onCancel={onCancel}
      {...rest}
    >
      <Spin spinning={isLoading}>
        <Form name="save-customer" {...formItemLayout} form={form}>
          <div className="form-group">
            <div className="customer-address">Địa chỉ nhận hàng</div>
            <Row gutter={24}>
              <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                <Form.Item
                  name="customer_province"
                  label="Tỉnh / Thành"
                  rules={[
                    {
                      required: true,
                      message: 'Tỉnh / thành là bắt buộc',
                    },
                  ]}
                >
                  <Select
                    placeholder="Chọn tỉnh/thành phố"
                    labelInValue
                    showSearch
                    filterOption={filterLocation}
                    onChange={value => {
                      fetchListDistrict(value.key);
                      updateValidForm();
                      form.setFieldsValue({
                        customer_district: null,
                      });
                    }}
                  >
                    {listProvince?.map(province => (
                      <Option key={province.id} value={province.id}>
                        {province.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                <Form.Item
                  name="customer_district"
                  label="Quận / Huyện"
                  rules={[
                    {
                      required: true,
                      message: 'Quận / huyện là bắt buộc',
                    },
                  ]}
                >
                  <Select
                    placeholder="Chọn quận/huyện"
                    labelInValue
                    showSearch
                    filterOption={filterLocation}
                    onChange={value => {
                      fetchListWard(value.key);
                      updateValidForm();
                      form.setFieldsValue({
                        customer_ward: null,
                      });
                    }}
                  >
                    {listDistrict?.map(district => (
                      <Option key={district.id} value={district.id}>
                        {district.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                <Form.Item
                  name="customer_ward"
                  label="Phường / xã"
                  rules={[
                    {
                      required: true,
                      message: 'Phường / xã là bắt buộc',
                    },
                  ]}
                >
                  <Select
                    placeholder="Chọn phường/xã"
                    labelInValue
                    showSearch
                    filterOption={filterLocation}
                    onChange={updateValidForm}
                  >
                    {listWard?.map(ward => (
                      <Option key={ward.id} value={ward.id}>
                        {ward.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item
                  name="customer_street"
                  label="Số nhà & tên đường"
                  rules={[
                    {
                      required: true,
                      message: 'Số nhà và tên đường là bắt buộc',
                    },
                  ]}
                >
                  <Input
                    placeholder="Nhập số nhà, tên đường, phường/xã"
                    onChange={updateValidForm}
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>
          <div className="form-action form-group">
            <Button
              className="btn-cancel btn-sm"
              color="grayBlue"
              width="60px"
              onClick={onCancel}
            >
              Hủy
            </Button>
            <Button
              disabled={!isValidForm}
              className="btn-ok btn-sm"
              width="100px"
              onClick={saveAddress}
            >
              Xác nhận
            </Button>
          </div>
        </Form>
      </Spin>
    </SaveAddressModal>
  );
});

export const SaveAddressModal = styled(Modal)`
  min-height: 550px;
  top: 50%;
  transform: translateY(-50%) !important;
  padding-bottom: 0;
  .modal-title__main {
    font-size: 18px;
    font-weight: bold;
  }
  .modal-title__desc {
    font-weight: normal;
    font-size: 14px;
    /* color: ${({ theme }) => theme.text}; */
    color: #828282;
    margin-top: 2px;
  }
  .ant-modal-header {
    border-bottom: none;
    padding: 21px 25px 14px 24px;
  }
  .ant-modal-content {
    height: 100%;
  }
  .ant-spin-nested-loading,
  .ant-spin-container {
    height: 100%;
  }
  .ant-spin-nested-loading > div > .ant-spin {
    min-height: unset;
  }
  .ant-modal-body {
    padding: 0;
    margin-top: 2px;
  }
  .form-group {
    padding: 0 25px;
  }
  .ant-form {
    .ant-form-item-label {
      padding-bottom: 9px;
      label {
        line-height: 1;
        font-weight: 500;
        height: unset;
      }
    }
    .ant-input,
    .ant-select-selection-search-input,
    .ant-select-selection-item,
    .ant-select-selection-placeholder {
      height: 40px !important;
      font-size: 14px !important;
    }
    .divider {
      margin: 6px 0 20px 0;
    }
    .ant-form-item {
      margin-bottom: 15px;
    }
    .customer-address {
      font-weight: bold;
      font-size: 16px;
      margin-bottom: 17px;
      line-height: 1;
    }
    .form-action {
      display: flex;
      text-align: right;
      margin-top: 12px;
      padding-bottom: 21px;
      .btn-cancel {
        margin-left: auto;
      }
      .btn-ok {
        margin-left: 14px;
      }
    }
  }
`;
