import * as React from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { CustomStyle } from 'styles/commons';
import { Table, Spin, Row, Col, List, Tooltip, Menu, Modal } from 'antd';
import { selectLoading } from '../slice/selectors';
import { formatMoney } from 'utils/helpers';
import constants from 'assets/constants';
import { Image, BoxColor, Button, A, Dropdown } from 'app/components';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { DownOutlined } from '@ant-design/icons';
import request from 'utils/request';
import Confirm from 'app/components/Modal/Confirm';
import notification from 'utils/notification';
import { Link } from 'app/components';
import { useOrdersSlice } from '../slice';
import { getOrderAction } from 'utils/helpers';
const { Item } = Menu;

const confirmAction = constants.SELLER_FULFILLMENT_ACTION.CONFIRM;
const cancelAction = constants.SELLER_FULFILLMENT_ACTION.CANCEL;
const ignoreAction = constants.SELLER_FULFILLMENT_ACTION.IGNORE;

export default function TableVarient(props) {
  const { data, gotoPage, history } = props;
  const isLoading = useSelector(selectLoading);
  const isPersonalOrder = !data?.shop_order_id;
  const [actionType, setActionType] = React.useState();
  const [isShowConfirmStatus, setIsShowConfirmStatus] = React.useState(false);
  const [isLoadingConfirm, setLoadingConfirm] = React.useState(false);
  const [orderConfirm, setOrderConfirm] = React.useState({});
  const dispatch = useDispatch();
  const { actions } = useOrdersSlice();
  let reasonSrc = [];
  if (data?.platform) {
    reasonSrc = constants.ORDER_CANCEL_REASON[data?.platform].filter(
      item =>
        !item.available_status_list ||
        item.available_status_list.includes('*') ||
        item.available_status_list.includes(`${data?.shop_status}`),
    );
  }
  const Uniq = (arr = []) => {
    return arr.reduce(
      (t, v) =>
        t
          .map(item => item.product_variation_id)
          .includes(v.product_variation_id)
          ? [
              {
                ...t.find(
                  e => e.product_variation_id == v.product_variation_id,
                ),
                quantity:
                  t.find(e => e.product_variation_id == v.product_variation_id)
                    .quantity + 1,
              },
            ]
          : [...t, v],
      [],
    );
  };
  function formatDateStr(dateStr) {
    return moment(dateStr).format('HH:mm DD/MM/YYYY');
  }

  const loadOrderData = () => {
    dispatch(actions.getDetail(data?.id));
  };

  const loadData = () => {
    gotoPage(history.location.search, true);
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
      isSuccess = await loadOrderConfirmInfo(data);
    }
    isSuccess && setIsShowConfirmStatus(!isShowConfirmStatus);
  };

  const loadOrderConfirmInfo = async order => {
    setLoadingConfirm(true);
    try {
      const response = await request(
        `oms/seller/order/${order.id}/confirm-info`,
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
              data?.shop_order_id || data?.id
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

  const updateDeliverd = () => {
    request(`oms/seller/orders/${data?.id}/set-delivered`, {
      method: 'put',
      data: {
        fulfillment_status: 'seller_delivered',
      },
    })
      .then(response => {
        if (response.is_success) {
          notification(
            'success',
            `Order #${data?.code}: đã nhận được hàng!`,
            'Thành công!',
          );
          loadOrderData();
          loadData();
        }
      })
      .catch(err => err);
  };

  const getCancelReasonTranslate = value => {
    const cancel_reason = constants?.ORDER_CANCEL_REASON_NOTE.find(
      v => v.id === value,
    );
    return cancel_reason?.name;
  };

  const submitAction = (reasonId, comment) => {
    const payload = {
      fulfillment_status: actionType,
      reason_id: reasonId || '',
      note: comment || '',
    };
    if (
      actionType === confirmAction ||
      (actionType === cancelAction && !data.platform)
    ) {
      delete payload.note;
      delete payload.reason_id;
    }
    request(`oms/seller/orders/${data?.id}/change-fulfill-status`, {
      method: 'put',
      data: payload,
    })
      .then(response => {
        if (response.is_success) {
          notification(
            'success',
            `Order #${data?.code} đã ${
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
          loadData();
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

  const getMenu = actions => {
    return (
      <Menu>
        {actions.seller_confirm && (
          <Item onClick={handlPageeAction(confirmAction)}>Xác nhận</Item>
        )}
        {data?.fulfillment_status ===
          constants.ORDER_FULFILLMENT_STATUS.READY_TO_SHIP.id &&
          isPersonalOrder && (
            <Item onClick={updateDeliverd}>Đã nhận được hàng</Item>
          )}
        {actions.order_cancel && (
          <Item
            onClick={handlPageeAction(
              data?.fulfillment_status ===
                constants.ORDER_FULFILLMENT_STATUS.PENDING.id
                ? ignoreAction
                : cancelAction,
            )}
          >
            Hủy đơn
          </Item>
        )}
      </Menu>
    );
  };
  const renderAction = text => {
    if (text !== data?.order_item[0].id || !data?.is_map) return null;
    if (isLoading) return null;
    const actions = getOrderAction(
      data?.platform,
      'seller',
      data?.odii_status,
      data?.fulfillment_status,
      data?.shop_status,
    );
    if (!actions) return null;
    return (
      <>
        <Dropdown overlay={getMenu(actions)} trigger={['click']}>
          <CustomStyle className="btn-printf">
            Các thao tác
            <DownOutlined />
          </CustomStyle>
        </Dropdown>
      </>
    );
  };

  const columns = React.useMemo(
    () => [
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Sản phẩm</div>
            {/* <div className="addition"></div> */}
          </div>
        ),
        dataIndex: 'product_name',
        key: 'product_name',
        width: '35%',
        className: 'order-item',
        render: (text, record) => (
          <WrapperOption>
            <div>
              <List.Item>
                <List.Item.Meta
                  avatar={<Image size="45x45" src={record?.thumb} />}
                  title={
                    <>
                      <CustomStyle ml={{ xs: 's1' }}>
                        <Tooltip title={text} mouseEnterDelay={0.8}>
                          {record.metadata?.shop_product_name || text}
                        </Tooltip>
                      </CustomStyle>
                      {(record.metadata?.shop_variation_name ||
                        record.product_variation_name) && (
                        <div
                          style={{
                            color: '#8D8D8D',
                            fontSize: 12,
                            marginTop: 5,
                            marginLeft: 2,
                          }}
                        >
                          {record.metadata?.shop_variation_name ||
                            record.product_variation_name}
                        </div>
                      )}
                    </>
                  }
                  // description={`${record.option_1}${
                  //   record.option_2 ? `/${record.option_2}` : ''
                  // }${record.option_3 ? `/${record.option_3}` : ''}`}
                />
              </List.Item>
            </div>
            <div className="text-right">
              <Tooltip title="Đơn giá sản phẩm seller bán">
                <CustomStyle>{formatMoney(record.retail_price)}</CustomStyle>
              </Tooltip>
              {/* <Tooltip title="Đơn giá sản phẩm nhà cung cấp bán cho seller">
                <CustomStyle className="payment-method">
                  {formatMoney(record.origin_supplier_price || 0)}
                </CustomStyle>
              </Tooltip> */}
              <div className="payment-method">x{record.quantity}</div>
            </div>
          </WrapperOption>
        ),
      },
      {
        title: (
          <div className="custome-header">
            <CustomStyle textAlign="right" className="title-box">
              Trạng thái đơn hàng
            </CustomStyle>
            {/* <div className="addition"></div> */}
          </div>
        ),
        dataIndex: 'id',
        key: 'id',
        render: (text, record) => {
          if (text === data?.order_item[0].id) {
            const currentStatus =
              constants.ODII_ORDER_STATUS_NAME[data?.odii_status];
            // if (data?.platform === 'shopee') {
            //   currentStatus =
            //     constants.SHOPEE_ORDER_SHOP_STATUS[data?.shop_status] ||
            //     constants.ORDER_SHOP_STATUS[0];
            // } else {
            //   currentStatus =
            //     constants.ORDER_SHOP_STATUS.find(
            //       v => v.id === data?.shop_status,
            //     ) || constants.ORDER_SHOP_STATUS[0];
            // }

            return (
              isEmpty(currentStatus) || (
                <div
                  className="d-flex"
                  style={{ justifyContent: 'center', flexDirection: 'column' }}
                >
                  <div
                    className="d-flex"
                    style={{
                      textTransform: 'uppercase',
                      justifyContent: 'center',
                    }}
                  >
                    {currentStatus.icon && (
                      <img alt="" src={currentStatus.icon} />
                    )}
                    <CustomStyle
                      ml={{ xs: 's2' }}
                      fontSize={14}
                      fontWeight={600}
                      color={currentStatus.color}
                    >
                      {currentStatus.name}
                    </CustomStyle>
                  </div>
                  {data?.cancel_reason && (
                    <CustomStyle
                      ml={{ xs: 's2' }}
                      textAlign="center"
                      fontSize="12px"
                      color="#8d8d8d"
                    >
                      {getCancelReasonTranslate(data?.cancel_reason) ||
                        data?.cancel_reason}
                    </CustomStyle>
                  )}
                  {['delivery', 'COMPLETED', 'INVOICE_PENDING'].includes(
                    data?.shop_status,
                  ) && (
                    <CustomStyle ml={{ xs: 's2' }} textAlign="center">
                      {formatDateStr(data?.updated_at)}
                    </CustomStyle>
                  )}
                </div>
              )
            );
          }
        },
      },
      {
        title: (
          <div className="custome-header">
            <CustomStyle className="title-box" pl={{ xs: 's4' }}>
              TT cung cấp
            </CustomStyle>
            {/* <div className="addition"></div> */}
          </div>
        ),
        dataIndex: 'id',
        key: 'id',
        width: '10%',
        render: text => {
          if (text === data?.order_item[0].id) {
            const currentStatus =
              constants.ORDER_FULFILLMENT_STATUS[
                data?.fulfillment_status?.toUpperCase()
              ];
            return (
              currentStatus && (
                <div
                  className="d-flex"
                  style={{
                    textTransform: 'uppercase',
                    justifyContent: 'left',
                  }}
                >
                  {currentStatus.icon && (
                    <img alt="" src={currentStatus.icon} />
                  )}
                  <CustomStyle
                    ml={{ xs: 's2' }}
                    fontSize={14}
                    fontWeight={600}
                    color={currentStatus.color}
                  >
                    {currentStatus.name}
                  </CustomStyle>
                </div>
              )
            );
          }
        },
      },
      {
        title: (
          <div className="custome-header">
            <CustomStyle textAlign="right" className="title-box">
              Thanh toán
            </CustomStyle>
            {/* <div className="addition"></div> */}
          </div>
        ),
        dataIndex: 'id',
        key: 'id',
        width: '10%',
        className: 'order-item',
        render: text => {
          if (text === data?.order_item[0].id) {
            return (
              <>
                <Tooltip title="Tổng tiền đơn hàng">
                  <CustomStyle className="price">
                    <span>{formatMoney(data?.total_retail_price)}</span>
                  </CustomStyle>
                </Tooltip>
                {/* <Tooltip title="Tổng tiền supplier nhận được">
                  <CustomStyle className="payment-method">
                    <span>
                      {formatMoney(data?.total_origin_supplier_price) || 0}
                    </span>
                  </CustomStyle>
                </Tooltip> */}
                <CustomStyle className="payment-method">
                  {data?.platform
                    ? ['COD', 'CASH_ON_DELIVERY'].includes(data?.payment_method)
                      ? 'Thanh toán khi nhận hàng'
                      : data?.payment_method
                    : data?.payment_status === 'paid'
                    ? 'Đã thanh toán'
                    : 'Thanh toán khi nhận hàng'}
                </CustomStyle>
              </>
            );
          }
        },
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Cửa hàng</div>
            {/* <div className="addition"></div> */}
          </div>
        ),
        dataIndex: 'id',
        key: 'id',
        width: '145px',
        render: text => {
          if (text === data?.order_item[0].id) {
            const logo = constants.SALE_CHANNEL.filter(
              item => item.id.toLowerCase() === data?.store.platform,
            );
            return (
              <>
                {!data?.store?.id ? (
                  <>
                    <span className="value-empty">
                      {data?.store_source || 'Khác'}
                    </span>
                  </>
                ) : (
                  <CustomStyle
                    className="store-info"
                    color="text"
                    fontSize={{ xs: 'f2' }}
                  >
                    <img
                      alt=""
                      src={logo && logo[0]?.icon}
                      height="20px"
                      width="20px"
                    />
                    <span className="store-name">{data?.store.name}</span>
                  </CustomStyle>
                )}
              </>
            );
          }
        },
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Thao tác</div>
            {/* <div className="addition"></div> */}
          </div>
        ),
        dataIndex: 'id',
        key: 'id',
        width: '140px',
        className: 'order-action',
        render: renderAction,
      },
    ],
    [data],
  );
  return (
    <TableVarientCustom>
      <Spin tip="Đang tải..." spinning={isLoading || data ? false : true}>
        <Row gutter={24}>
          <Col span={24}>
            <div>
              <Table
                columns={columns}
                dataSource={Uniq(data?.order_item)}
                pagination={false}
                rowSelection={false}
              ></Table>
            </div>
          </Col>
        </Row>
      </Spin>
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
            !!data.platform && {
              message: getConfirmMessage(),
            }
          }
          handleConfirm={submitAction}
          handleCancel={toggleConfirmModal}
          reasonList={
            actionType === confirmAction ||
            (actionType === cancelAction && !data.platform)
              ? null
              : reasonSrc
          }
          cancelWarning={
            actionType === cancelAction ? getConfirmMessage() : null
          }
        />
      )}
    </TableVarientCustom>
  );
}

export const PrintProgressModal = styled(Modal)`
  .print-progress-content {
    display: flex;
    justify-content: space-between;
    .progress-title {
      margin-left: 10px;
    }
    .loading-icon {
      color: ${({ theme }) => theme.primary};
    }
  }
`;

const WrapperOption = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  .ant-image {
    width: 56px;
    border-radius: 4px;
  }
  .ant-list-item-meta {
    align-items: center;

    .ant-list-item-meta-content {
      width: auto;
      max-width: 300px;
    }

    @media screen and (max-width: 1366px) {
      .ant-list-item-meta-content {
        max-width: 200px;
      }
    }
  }
  .ant-list-item-meta-title > * {
    overflow: hidden;
    /* text-align: justify; */
    display: -webkit-box;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
    line-height: 18px; /* fallback */
    max-height: 36px;
    -webkit-line-clamp: 2; /* number of lines to show */
  }
  .ant-list-item-meta-description {
    font-weight: 400;
    font-size: 12;
    color: rgba(0, 0, 0, 0.4);
  }

  .ant-list-item-meta-avatar {
    margin-right: 6px;
  }

  .ant-image-img {
    width: 56px;
  }
`;

const TableVarientCustom = styled.div`
  .ant-table-thead {
    display: none;
  }
  .ant-table-selection-column {
    opacity: 0;
  }
  .ant-table-tbody > tr {
    height: 44px;
  }
  .ant-table-tbody > tr > td {
    padding: 0px 10px !important;
    border-bottom: 1px solid #fff !important;
  }
  .ant-table-tbody > tr.ant-table-row:hover > td {
    background: #fff !important;
  }
  .order-item {
    .price span {
      font-size: 14px;
      font-weight: 700;
    }

    .payment-method {
      font-size: 12px;
      color: #8d8d8d;
    }
  }
  .order-action {
    .print-status {
      font-size: 12px;
      padding: 4px 8px;
      width: auto;
    }
    .btn-printf {
      font-size: 13px;
      color: #1976d2;
      margin-top: 5px;
      margin-left: 5px;
      align-items: center;
      cursor: pointer;
      font-weight: 500;

      .anticon-down {
        margin-left: 5px;
      }

      &:hover {
        color: #40a9ff;
        text-decoration: underline;
      }
    }
  }
`;

const SpanPrice = styled.span`
  color: orange;
  font-weight: bold;
`;
