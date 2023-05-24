import React, { useState, useEffect, useRef } from 'react';
import { OrderCodeWrapper } from '../../styles/OrderDetail';
import { Tooltip } from 'antd';
import { isEmpty } from 'lodash';

export default function OrderCode({ order }) {
  const isLoading = isEmpty(order);
  const [isShowCopyTitle, setShowCopyTitle] = useState(false);

  const copyIconRef = useRef(null);

  const copyOrderCode = () => {
    try {
      const delayHide = 850;
      copyIconRef?.current?.select();
      document.execCommand('Copy');
      setShowCopyTitle(true);
      setTimeout(() => {
        setShowCopyTitle(false);
      }, delayHide);
    } catch {}
  };

  const emptyData = (text = 'Hiện chưa có') => (
    <span className="value-empty">{text}</span>
  );

  return (
    !isLoading && (
      <OrderCodeWrapper className="box-df">
        <div className="order-top-wrapper">
          <div className="order-top__title section-title">Mã đơn hàng</div>
          <div className="order-top__name">
            <input
              readOnly
              className="order-code__value"
              ref={copyIconRef}
              value={
                !order.platfrom ? order.code : order.shop_order_id || order.code
              }
            ></input>
            <Tooltip
              visible={isShowCopyTitle}
              placement="bottomRight"
              title="Đã copy"
              trigger="click"
            >
              <i className="copy-icon far fa-copy" onClick={copyOrderCode}></i>
            </Tooltip>
          </div>
        </div>
        <div className="order-code__center">
          <div className="center-item">
            {/* <div>
              <div>
                <i className="center-item__icon far fa-receipt"></i>Hóa đơn
              </div>
              <div>{order.invoice_number || emptyData('Không')}</div>
            </div> */}
            <div>
              <div>
                <i className="center-item__icon far fa-box-up"></i>Mã vận chuyển
              </div>
              <div style={{ textAlign: 'right' }}>
                {order.tracking_id || emptyData('Không')}
              </div>
            </div>
            <div>
              <div>
                <i className="center-item__icon far fa-truck"></i>Vận chuyển
              </div>
              <div>{order.shipment_provider || emptyData('Không')}</div>
            </div>
          </div>
        </div>
      </OrderCodeWrapper>
    )
  );
}
