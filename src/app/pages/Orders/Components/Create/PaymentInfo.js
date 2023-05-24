import React, { useState, useEffect, useMemo, memo } from 'react';
import { PaymentInfoWrapper } from '../../styles/OrderDetail';

import { Select, Spin } from 'antd';
import { themes } from 'styles/theme/themes';
import { formatMoney } from 'utils/helpers';
import { isEmpty } from 'lodash';
import request from 'utils/request';
import notification from 'utils/notification';

const { Option } = Select;
const { light: theme } = themes;

const paymentStatuses = [
  {
    id: 'pending',
    name: 'Thanh toán sau',
    color: 'grayBlue',
    value: 'pending',
  },
  {
    id: 'paid',
    name: 'Thanh toán ngay',
    color: 'greenMedium1',
    value: 'paid',
  },
];
const DEFAULT_PAYMENT_STATUS = paymentStatuses[0].value;

export default memo(function PaymentInfo({
  selectedVariations,
  customerInfo,
  shippingFee,
  onlyShipFee,
  insuranceFee,
  paymentStatus,
  setPaymentStatus,
  setCustomerInfo,
  setDataShipment,
}) {
  const [isLoading, setLoading] = useState(false);
  useEffect(() => {
    setPaymentStatus(DEFAULT_PAYMENT_STATUS);
  }, []);

  useEffect(() => {
    if (selectedVariations.length > 0 && !isEmpty(customerInfo)) {
      fetchTransportFee(customerInfo, selectedVariations);
    }
  }, [customerInfo, selectedVariations]);

  const fetchTransportFee = async (customerInfo, selectedVariations) => {
    setLoading(true);
    const data = {
      province: customerInfo.province_name,
      district: customerInfo.district_name,
      ward: customerInfo.ward_name,
      address: customerInfo.address1,
      weight: getTotalItemsWeight(),
      value: getTotalItemsPrice(),
      location_id: selectedVariations[0].supplier_warehousing?.location_id,
    };
    try {
      const response = await request('oms/seller/order/transport', {
        method: 'post',
        data,
      });
      if (response.is_success) {
        if (!response.data) {
          notification(
            'error',
            response.data?.message,
            'Lỗi lấy phí vận chuyển !',
          );
          setCustomerInfo({});
          return;
        }
        setDataShipment(response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  function getTotalNum() {
    let totalNum = 0;
    selectedVariations?.forEach(variation => {
      totalNum += variation.quantity;
    });
    return totalNum;
  }

  function getTotalItemsPrice() {
    let totalPrice = 0;
    selectedVariations?.forEach(variation => {
      totalPrice += variation.quantity * variation.price;
    });
    return totalPrice;
  }

  function getTotalItemsWeight() {
    let totalWeight = 0;
    selectedVariations?.forEach(variation => {
      totalWeight += variation.weight_grams * variation.quantity;
    });
    return totalWeight;
  }

  return (
    <PaymentInfoWrapper className="box-df">
      <div className="payment-title">
        <span className="section-title">Thanh toán</span>
      </div>
      <Spin spinning={isLoading}>
        <div className="payment-content create-order">
          <div className="payment-content__top">
            <div className="content-top__item">
              <span>
                <span>Số lượng</span>
              </span>
              <span>{getTotalNum()}</span>
            </div>
            <div className="content-top__item">
              <span>Tổng tiền hàng</span>
              <span>{formatMoney(getTotalItemsPrice())}</span>
              {/* <span>-</span> */}
            </div>
            <div className="content-top__item">
              <span>Phí vận chuyển</span>
              <span>{formatMoney(onlyShipFee)}</span>
            </div>
            <div className="content-top__item">
              <span>Phí bảo hiểm hàng hóa</span>
              <span>{formatMoney(insuranceFee)}</span>
            </div>
            <div className="content-top__item">
              <span>Phải thu</span>
              <span>
                {formatMoney(getTotalItemsPrice() + shippingFee || 0)}
              </span>
            </div>
          </div>
          <div className="payment-content__bottom update-bottom">
            <div>
              <span>Trạng thái thanh toán</span>
              {/* {paymentStatus === paymentStatuses[0].id ? (
                <div className="help-text">
                  Odii sẽ tạm thu tiền hàng (Giá NCC) và sẽ hoàn lại cùng với
                  lợi nhuận sau khi đơn hoàn thành
                </div>
              ) : (
                <div className="help-text">
                  Odii sẽ thu trực tiếp tiền hàng (Giá NCC) và tiền giao vận{' '}
                  <div>(Phí vận chuyển + Phí bảo hiểm hàng hóa)</div>
                </div>
              )} */}
            </div>
            <Select
              className="status-select"
              defaultValue={DEFAULT_PAYMENT_STATUS}
              onChange={value => {
                setPaymentStatus(value);
              }}
            >
              {paymentStatuses.map(status => (
                <Option key={status.id} value={status.value}>
                  <div
                    className="font-df"
                    style={{ color: theme[status?.color] }}
                  >
                    {status.name}
                  </div>
                </Option>
              ))}
            </Select>
          </div>
        </div>
      </Spin>
    </PaymentInfoWrapper>
  );
});
