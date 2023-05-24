import React, { useState, useEffect } from 'react';
import { Timeline, Skeleton, Form, Button } from 'antd';
import { Input, BoxColor } from 'app/components';
import { OrderHistoryWrapper } from '../../styles/OrderDetail';
import { isEmpty } from 'lodash';
import constants from 'assets/constants';
import request from 'utils/request';
import { formatDate } from 'utils/helpers';

const Item = Form.Item;

export default function OrderHistory({ orderData, orderId }) {
  const [form] = Form.useForm();
  const [isLoadingInternal, setLoadingInternal] = useState(false);
  const [orderTimeline, setOrderTimeline] = useState([]);

  const inputNoteName = 'input-note';

  const isLoadingPage = isLoadingInternal || isEmpty(orderData);
  useEffect(() => {
    fetchOrderTimeLine();
  }, []);

  const getFirstOrderTime = () => {
    if (isEmpty(orderData)) {
      return [];
    }
    return {
      short_description: 'Tiếp nhận đơn hàng',
      created_at: orderData.created_at,
    };
  };

  const fetchOrderTimeLine = async () => {
    setLoadingInternal(true);
    const response = await request(`oms/seller/order/${orderId}/timeline`, {
      method: 'get',
    });
    if (response.is_success) {
      setOrderTimeline(response.data);
    }
    setLoadingInternal(false);
  };

  const getAllOrderTimeLine = () => {
    return [...(orderTimeline || []), getFirstOrderTime()];
  };

  const getFulfillmentStatus = fulfillmentStatusId => {
    return constants.ORDER_FULFILLMENT_STATUS[
      fulfillmentStatusId?.toUpperCase()
    ];
  };

  const getTimelineTitle = timeline => {
    let title;
    switch (timeline?.action) {
      case 'comment':
        title = timeline.note;
        break;
      default:
        const fulfillmentStatusId = timeline?.metadata?.fulfillment_status;
        const fulfillmentStatus =
          fulfillmentStatusId && getFulfillmentStatus(fulfillmentStatusId);
        const fulfillmentStatusDesc = fulfillmentStatus && (
          <>
            . Trạng thái:&nbsp;
            <BoxColor
              className="fulfillment-status font-df"
              notBackground
              colorValue={fulfillmentStatus?.color}
            >
              {fulfillmentStatus?.name || ''}
            </BoxColor>
          </>
        );
        title = (
          <>
            {timeline.short_description}
            {fulfillmentStatusDesc || ''}
          </>
        );
        break;
    }
    // return timeline.action === 'comment'
    //   ? 'Ghi chú: ' + timeline.note
    //   : timeline.short_description ;
    return title;
  };

  const submitNote = async () => {
    var note = form.getFieldsValue()[inputNoteName].trim();
    const response = await request(`oms/seller/order/${orderId}/comment`, {
      method: 'post',
      data: {
        note: note,
      },
    });
    if (response.is_success) {
      fetchOrderTimeLine();
      form.resetFields();
    }
  };

  const pageContent = isLoadingPage ? (
    <Skeleton active paragraph={{ rows: 4 }} />
  ) : (
    <>
      <div className="order-history__top">
        <div>
          <span className="section-title">Lịch sử đơn hàng</span>
        </div>
        <Form
          form={form}
          name="profile"
          scrollToFirstError
          onFinish={submitNote}
        >
          <div className="order-note">
            <Item
              name={inputNoteName}
              rules={[
                {
                  required: true,
                  message: 'Nội dung ghi chú không được để trống',
                },
                { min: 8, message: 'Nội dung ghi chú ít nhất 8 kí tự' },
              ]}
            >
              <Input
                placeholder="Thêm nội dung ghi chú"
                className="order-note__input"
                allowClear
                size="medium"
              />
            </Item>
            <Button
              type="primary"
              className="order-note__btn"
              htmlType="submit"
            >
              <span className="note-btn__title font-df">Gửi</span>
              <svg
                className="note-submit-icon"
                width="12"
                height="13"
                viewBox="0 0 12 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.1211 6.48522C11.121 6.32891 11.0793 6.17543 11.0003 6.04058C10.9212 5.90573 10.8077 5.79436 10.6713 5.71794L1.38724 0.51883C1.23103 0.43135 1.05184 0.393631 0.873628 0.410717C0.695411 0.427803 0.526654 0.498878 0.389914 0.614444C0.253174 0.730009 0.154965 0.884559 0.108413 1.05744C0.0618623 1.23031 0.0691868 1.41328 0.129408 1.58188L1.72355 6.04549L5.86515 6.04549C5.98178 6.04549 6.09363 6.09181 6.17609 6.17428C6.25856 6.25675 6.30489 6.36859 6.30489 6.48522C6.30489 6.60184 6.25856 6.71369 6.17609 6.79616C6.09363 6.87862 5.98178 6.92495 5.86515 6.92495L1.72355 6.92495L0.129408 11.3886C0.0725379 11.5448 0.0615734 11.7141 0.0978092 11.8764C0.134045 12.0387 0.215969 12.1872 0.333904 12.3045C0.351704 12.3223 0.370377 12.3394 0.389923 12.356C0.526187 12.4725 0.695034 12.5442 0.873486 12.5613C1.05194 12.5784 1.23133 12.5401 1.38724 12.4516L10.6713 7.2525C10.8077 7.17604 10.9212 7.06467 11.0002 6.92983C11.0793 6.79498 11.121 6.64152 11.1211 6.48522Z"
                  fill="white"
                />
              </svg>
            </Button>
          </div>
        </Form>
      </div>
      <div className="store-info_content">
        <div className="order-timeline">
          <Timeline>
            {getAllOrderTimeLine().map((item, index) => (
              <Timeline.Item key={index} color="green">
                <p className="timeline__title">{getTimelineTitle(item)}</p>
                <p className="timeline__desc">{formatDate(item.created_at)}</p>
              </Timeline.Item>
            ))}
          </Timeline>
        </div>
      </div>
    </>
  );

  return (
    <OrderHistoryWrapper className="box-df">{pageContent}</OrderHistoryWrapper>
  );
}
