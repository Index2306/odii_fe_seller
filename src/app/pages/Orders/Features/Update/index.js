import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useOrdersSlice } from '../../slice';
import { selectDetail, selectShowEmptyPage } from '../../slice/selectors';

import { Row, Col, Form as F, Space } from 'antd';

import { Button, PageWrapper, EmptyPage } from 'app/components';
import Confirm from 'app/components/Modal/Confirm';
import { globalActions } from 'app/pages/AppPrivate/slice';

import styled from 'styled-components/macro';
import { CustomTitle, CustomStyle } from 'styles/commons';
import { PageWrapperDefault } from '../../styles/OrderDetail';

import GeneralStatistic from '../../Components/Update/GeneralStatistic';
import ListOrderItem from '../../Components/Update/ListOrderItem';
import PaymentInfo from '../../Components/Update/PaymentInfo';
import CustomerInfo from '../../Components/Update/CustomerInfo';
import StoreInfo from '../../Components/Update/StoreInfo';
import WarehousingInfo from '../../Components/Update/WarehousingInfo';
import OrderHistory from '../../Components/Update/OrderHistory';

import { formatMoney } from 'utils/helpers';
import constants from 'assets/constants';
import request from 'utils/request';
import notification from 'utils/notification';
import OrderCode from '../../Components/Update/OrderCode';
import OrderStatus from '../../Components/Update/OrderStatus';

const Item = F.Item;

//fulfillment action
const confirmAction = constants.SELLER_FULFILLMENT_ACTION.CONFIRM;
const cancelAction = constants.SELLER_FULFILLMENT_ACTION.CANCEL;
const ignoreAction = constants.SELLER_FULFILLMENT_ACTION.IGNORE;

export function UpdateOrder({ match, history }) {
  const [isShowConfirmStatus, setIsShowConfirmStatus] = React.useState(false);
  const [isLoadingConfirm, setLoadingConfirm] = React.useState(false);
  const [actionType, setActionType] = React.useState();
  const [orderConfirm, setOrderConfirm] = React.useState({});

  const { id } = useParams();
  const dispatch = useDispatch();
  const { actions } = useOrdersSlice();
  const order = useSelector(selectDetail);
  const isEmptyPage = useSelector(selectShowEmptyPage);

  const isPersonalOrder = !order?.shop_order_id;
  let reasonSrc = [];
  if (order?.platform) {
    reasonSrc = constants.ORDER_CANCEL_REASON[order?.platform].filter(
      item =>
        !item.available_status_list ||
        item.available_status_list.includes('*') ||
        item.available_status_list.includes(`${order?.shop_status}`),
    );
  }
  useEffect(() => {
    loadOrderData();
    return () => {
      dispatch(actions.getDetailDone([]));
    };
  }, []);

  useEffect(() => {
    return () => {
      if (isEmptyPage) {
        dispatch(actions.clearEmptyPage());
      }
    };
  });

  useEffect(() => {
    const dataBreadcrumb = {
      menus: [
        {
          name: 'Đơn hàng',
          link: '/orders',
        },
        {
          name: 'Chi tiết đơn hàng',
        },
      ],
      fixWidth: true,
      actions: (
        <Item className="m-0" shouldUpdate>
          <div className="d-flex justify-content-between">
            <Space>{getPageAction()}</Space>
          </div>
        </Item>
      ),
    };
    const orderCode = !order?.platform
      ? order?.code
      : order?.shop_order_id || order?.code;
    dataBreadcrumb.title = orderCode ? `#${orderCode}` : '';
    dispatch(globalActions.setDataBreadcrumb(dataBreadcrumb));
    return () => {
      dispatch(globalActions.setDataBreadcrumb({}));
    };
  }, [order]);

  const loadOrderData = () => {
    dispatch(actions.getDetail(id));
  };

  const getCancelReasonTranslate = value => {
    const cancel_reason = constants?.ORDER_CANCEL_REASON_NOTE.find(
      v => v.id === value,
    );
    return cancel_reason?.name;
  };

  const getPageAction = () => {
    return (
      <>
        {order?.is_map &&
          order?.fulfillment_status ===
            constants.ORDER_FULFILLMENT_STATUS.SELLER_CONFIRMED.id && (
            <Button
              context="secondary"
              className="btn-cancel btn-sm"
              color="red"
              onClick={handlPageeAction(cancelAction)}
              width="90px"
            >
              Hủy đơn
            </Button>
          )}

        {order?.is_map &&
          (order?.fulfillment_status === null ||
            order?.fulfillment_status ===
              constants.ORDER_FULFILLMENT_STATUS.PENDING.id) && (
            <>
              <Button
                context="secondary"
                color="orange"
                onClick={handlPageeAction(ignoreAction)}
                className="btn-cancel btn-sm p-0"
                width="90px"
              >
                Hủy đơn
              </Button>
              <Button
                onClick={handlPageeAction(confirmAction)}
                className="btn-sm p-0"
                width="90px"
              >
                Xác nhận
              </Button>
            </>
          )}

        {order?.fulfillment_status ===
          constants.ORDER_FULFILLMENT_STATUS.READY_TO_SHIP.id &&
          isPersonalOrder && (
            <Button
              onClick={updateDeliverd}
              className="btn-sm p-0"
              width="150px"
            >
              Đã nhận được hàng
            </Button>
          )}
      </>
    );
  };

  const handlPageeAction = type => () => {
    setActionType(type);
    toggleConfirmModal();
  };

  const toggleConfirmModal = async () => {
    let isSuccess = true;
    if (isShowConfirmStatus) {
      setActionType('');
    } else {
      isSuccess = await loadOrderConfirmInfo(order);
    }
    isSuccess && setIsShowConfirmStatus(!isShowConfirmStatus);
  };

  const loadOrderConfirmInfo = async order => {
    setLoadingConfirm(true);
    try {
      const response = await request(
        `oms/seller/order/${order?.id}/confirm-info`,
        {
          method: 'get',
        },
      );
      setOrderConfirm(response.data);
      return true;
    } catch (err) {
      const errorMessages = [
        {
          code: 'product_variation_not_found',
          title: 'Xác nhận không thành công!',
          message: `Đơn hàng của bạn có chứa sản phẩm không thuộc Odii.
      Vui lòng kiểm tra lại hoặc liên hệ với bộ phận cskh.`,
        },
      ];
      const errorCode = err?.data?.error_code;
      const currError = errorMessages.find(error => (error.code = errorCode));
      currError && notification('error', currError.message, currError.title);
      return false;
    } finally {
      setLoadingConfirm(false);
    }
  };

  const getConfirmMessage = () => {
    const total_price = formatMoney(orderConfirm.total_fulfill_price);
    switch (actionType) {
      case confirmAction:
        return (
          <span>
            Bạn có chắc chắn muốn trả cho Odii&nbsp;
            <SpanPrice>{total_price}</SpanPrice>
            <br></br>để cung cấp đơn hàng này không?
          </span>
        );
      case cancelAction:
        return (
          <span>
            Đơn hàng{' '}
            <span style={{ fontWeight: 'bold' }}>{`#${
              order?.shop_order_id || order?.id
            }`}</span>{' '}
            sẽ bị hủy và Odii sẽ hoàn trả cho bạn số tiền{' '}
            <SpanPrice>{total_price}</SpanPrice>&nbsp;
          </span>
        );
      case ignoreAction:
        return <span>Bạn có chắc chắn muốn bỏ qua đơn hàng này không?</span>;
      default:
        return <span></span>;
    }
  };

  const submitAction = (reasonId, comment) => {
    const payload = {
      fulfillment_status: actionType,
      reason_id: reasonId || '',
      note: comment || '',
    };
    if (
      actionType === confirmAction ||
      (actionType === cancelAction && !order.platform)
    ) {
      delete payload.note;
      delete payload.reason_id;
    }
    request(`oms/seller/orders/${order?.id}/change-fulfill-status`, {
      method: 'put',
      data: payload,
    })
      .then(response => {
        if (response.is_success) {
          notification(
            'success',
            `Order #${order?.code} đã ${
              actionType === confirmAction
                ? 'được xác nhận'
                : actionType === cancelAction
                ? 'được hủy bỏ'
                : 'được bỏ qua'
            }!`,
            'Thành công!',
          );
          toggleConfirmModal();
          loadOrderData();
        }
      })
      .catch(err => {
        const errorMessages = [
          {
            code: 'product_of_order_item_not_same_warehousing',
            title: 'Xác nhận không thành công!',
            message: `Các sản phẩm trong đơn hàng phải thuộc cùng một kho hàng.
          Vui lòng kiểm tra lại hoặc liên hệ với bộ phận cskh.`,
          },
          {
            code: 'Không thể kết nối đến shopee, vui lòng thử lại sau',
            title: 'Xác nhận không thành công!',
            message: `Không thể kết nối đến shopee.
          Vui lòng kiểm tra lại hoặc liên hệ với bộ phận cskh.`,
          },
          {
            code:
              'Your refresh token is error ,please check refresh token or shopid.',
            title: 'Xác nhận không thành công!',
            message: `Kết nối với cửa hàng đã hết hạn.
          Vui lòng kiểm tra lại hoặc liên hệ với bộ phận cskh.`,
          },
        ];
        const errorCode = err?.data?.error_code;

        let currError = errorMessages.find(error => error.code === errorCode);
        if (currError) {
          notification('error', currError.message, currError.title);
        } else {
          let errMsg = err?.data?.error_message;
          errMsg = errMsg ? errMsg : errorCode;
          notification('error', errMsg, 'Xác nhận không thành công!');
        }
      });
  };

  const updateDeliverd = () => {
    request(`oms/seller/orders/${order?.id}/set-delivered`, {
      method: 'put',
      data: {
        fulfillment_status: 'seller_delivered',
      },
    })
      .then(response => {
        if (response.is_success) {
          notification(
            'success',
            `Order #${order?.code}: đã nhận được hàng!`,
            'Thành công!',
          );
          loadOrderData();
        }
      })
      .catch(err => err);
  };

  return isEmptyPage ? (
    <PageWrapper fixWidth>
      <CustomTitle height="calc(100vh - 120px)" className="d-flex flex-column">
        <CustomTitle>Đơn hàng</CustomTitle>
        <EmptyPage>
          <CustomStyle className="d-flex justify-content-center">
            <Button className="btn-md" onClick={() => history.push('/orders')}>
              Trở về danh sách
            </Button>
          </CustomStyle>
        </EmptyPage>
      </CustomTitle>
    </PageWrapper>
  ) : (
    <PageWrapperDefault fixWidth>
      <div className="page-detail-title font-sm">Tổng quan đơn hàng</div>
      <GeneralStatistic order={order}></GeneralStatistic>
      <Row gutter="26">
        <Col span={16}>
          <ListOrderItem order={order}></ListOrderItem>
          <PaymentInfo order={order}></PaymentInfo>
          <OrderHistory orderData={order} orderId={id}></OrderHistory>
        </Col>
        <Col span={8}>
          <OrderCode order={order}></OrderCode>
          <CustomerInfo order={order}></CustomerInfo>
          <StoreInfo order={order}></StoreInfo>
          {order?.odii_status > 0 && (
            <OrderStatus
              name="Trạng thái đơn hàng"
              order={order?.odii_status}
              status={constants?.ODII_ORDER_STATUS_NAME}
            />
          )}
          {order?.fulfillment_status && (
            <OrderStatus
              name="Trạng thái cung cấp"
              order={order?.fulfillment_status?.toUpperCase()}
              status={constants?.ORDER_FULFILLMENT_STATUS}
            />
          )}
          {order?.status?.toLowerCase() === 'canceled' && (
            <>
              {order?.cancel_reason && (
                <OrderStatus
                  name="Lý do hủy"
                  order={
                    getCancelReasonTranslate(order?.cancel_reason) ||
                    order?.cancel_reason
                  }
                  status={null}
                />
              )}
              {order?.cancelled_at && (
                <OrderStatus
                  name="Bên hủy"
                  order={order?.cancelled_at}
                  status={null}
                />
              )}
              {order?.note && (
                <OrderStatus
                  name="Nhận xét khi hủy"
                  order={order?.note}
                  status={null}
                />
              )}
            </>
          )}
          <WarehousingInfo order={order}></WarehousingInfo>
        </Col>
      </Row>
      {isShowConfirmStatus && (
        <Confirm
          isLoading={isLoadingConfirm}
          isFullWidthBtn
          isModalVisible={isShowConfirmStatus}
          color={actionType === confirmAction ? 'blue' : 'red'}
          title={`${
            actionType === confirmAction
              ? 'Xác nhận cung cấp'
              : actionType === cancelAction
              ? 'Hủy bỏ cung cấp'
              : 'Bỏ qua'
          } đơn hàng`}
          data={
            !!order.platform && {
              message: getConfirmMessage(),
            }
          }
          handleConfirm={submitAction}
          handleCancel={toggleConfirmModal}
          reasonList={
            actionType === confirmAction ||
            (actionType === cancelAction && !order.platform)
              ? null
              : reasonSrc
          }
          cancelWarning={
            actionType === cancelAction ? getConfirmMessage() : null
          }
        />
      )}
    </PageWrapperDefault>
  );
}

const SpanPrice = styled.span`
  color: orange;
  font-weight: bold;
`;
