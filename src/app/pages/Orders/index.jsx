/**
 *
 * Orders
 *
 */
import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col, Spin, Tooltip } from 'antd';
import { Tabs } from 'app/components';
import { isEmpty } from 'lodash';
import moment from 'moment';
import {
  Button,
  PageWrapper,
  // Image,
  // Divider,
  Table,
  // Select,
  // BoxColor,
  EmptyPage,
  Link,
} from 'app/components';
import constants from 'assets/constants';
import notification from 'utils/notification';
import { formatMoney, getOrderAction } from 'utils/helpers';
import {
  CustomTitle,
  CustomStyle,
  // SectionWrapper,
  SectionWrapperCustom,
} from 'styles/commons';
import {
  selectLoading,
  selectData,
  selectPagination,
  selectListStores,
  selectShowEmptyPage,
  selectSummary,
} from './slice/selectors';
import { useOrdersSlice } from './slice';
import { selectSelectedOrders } from './slice/selectors';
import Confirm from 'app/components/Modal/Confirm';
import styled from 'styled-components/macro';
import { getStores } from 'utils/providers';
import request from 'utils/request';
import { FilterBar } from './Features';
// import Color from 'color';
// import { defaultImage } from 'assets/images';
import { tooltip } from 'assets/images/dashboards';

import TableOrder from './Components/TableOrder';

const UPDATE_STATUS_CONFIRM_KEY = 'CONFIRM_UPDATE_STATUS_MODAL';
//fulfillment action
const confirmAction = constants.SELLER_FULFILLMENT_ACTION.CONFIRM;
const cancelAction = constants.SELLER_FULFILLMENT_ACTION.CANCEL;
const ignoreAction = constants.SELLER_FULFILLMENT_ACTION.IGNORE;
const { TabPane } = Tabs;

const initConfirmModel = {
  visible: false,
  loading: false,
  action: {},
};

export function Orders({ history }) {
  const dispatch = useDispatch();
  const { actions } = useOrdersSlice();
  const isLoading = useSelector(selectLoading);
  const pagination = useSelector(selectPagination);
  const data = useSelector(selectData);
  const summary = useSelector(selectSummary);
  const listStores = useSelector(selectListStores);
  const showEmptyPage = useSelector(selectShowEmptyPage);

  const [selectedRowsArray, setSelectedRowsArray] = React.useState([]);
  const [isShowConfirmStatus, setIsShowConfirmStatus] = React.useState(false);
  const [isLoadingConfirm, setLoadingConfirm] = React.useState(false);
  const [orderConfirm, setOrderConfirm] = React.useState({});
  const [detail, setDetail] = React.useState({});
  const [actionType, setActionType] = React.useState();
  const [tab, setTab] = React.useState();
  const [isShowCopyTitle, setShowCopyTitle] = React.useState(false);
  const [isShowCopy, setShowCopy] = React.useState(false);
  const [selected, setSelected] = React.useState(0);

  const selectedOrders = useSelector(selectSelectedOrders);
  // const [currModalKey, setCurrModalKey] = React.useState(null);
  const [confirmModel, setConfirmModel] = React.useState(initConfirmModel);
  // const [currModelAction, setCurrentModelAction] = React.useState({});

  React.useEffect(() => {
    getStores()
      .then(res => {
        if (!isEmpty(res?.data)) dispatch(actions.setListStores(res?.data));
      })
      .catch(() => null);
    return () => {
      dispatch(actions.resetWhenLeave());
    };
  }, []);

  // React.useEffect(() => {
  //   const delaySecond = 10000;
  //   let reloadPageInterval;
  //   let reloadPageTimeout;
  //   reloadPageTimeout = setTimeout(() => {
  //     reloadPageInterval = setInterval(() => {
  //       gotoPage('', true);
  //     }, delaySecond);
  //   }, delaySecond);
  //   return () => {
  //     clearInterval(reloadPageInterval);
  //     clearTimeout(reloadPageTimeout);
  //   };
  // }, []);

  const copyOrderCode = (e, record) => {
    navigator.clipboard.writeText(
      !record.platform ? record.code : record.shop_order_id || record.code,
    );
    setShowCopyTitle(true);
    setShowCopy(record.code);
    setTimeout(() => {
      setShowCopyTitle(false);
    }, 800);
  };

  const getSelectedOrderMetadata = items => {
    return {
      print_count: items.filter(item => item.actions && item.actions.print)
        .length,
      seller_confirm_count: items.filter(
        item => item.actions && item.actions.seller_confirm,
      ).length,
      supplier_confirm_count: items.filter(
        item => item.actions && item.actions.supplier_confirm,
      ).length,
      update_packing_count: items.filter(
        item => item.actions && item.actions.update_packing,
      ).length,
      ready_toship_count: items.filter(
        item => item.actions && item.actions.ready_toship,
      ).length,
      // Do not cancel multi order
      // order_cancel_count: items.filter(
      //   item => item.actions && item.actions.order_cancel,
      // ).length,
    };
  };
  const updateSelectedOrders = selectedOrders => {
    const result = {};
    const items = [];
    // let packingOrPrintNumber = 0;
    selectedOrders.forEach(order => {
      const actions = getOrderAction(
        order?.platform,
        'seller',
        order?.odii_status,
        order?.fulfillment_status,
        order?.shop_status,
      );
      const orderData = {
        id: parseInt(order.id),
        actions: actions,
        platform: order?.platform,
      };
      items.push(orderData);
    });
    result.items = items;
    result.metadata = getSelectedOrderMetadata(items);
    let hasAction = false;
    Object.keys(result.metadata).forEach(e => {
      if (result.metadata[e] > 0) {
        hasAction = true;
      }
    });
    result.hasAction = hasAction;
    return result;
  };
  const rowSelection = {
    selectedRowKeys: selectedRowsArray,
    // type: 'checkbox',
    onChange: (selectedRowKeys, selectedRows) => {
      setSelected(selectedRows.length);
      setSelectedRowsArray(selectedRowKeys);
      dispatch(actions.setSelectedOrders(updateSelectedOrders(selectedRows)));
    },
  };

  const columns = React.useMemo(
    () => [
      {
        title: (
          <div
            className="custome-header d-flex"
            style={{ justifyContent: 'space-between' }}
          >
            <div className="order-code title-box">ID đơn hàng</div>
            Đơn giá
            {/* {tab == 'ready_to_ship' && <BoxColor colorValue='#9D9D9D' notIcon style={{textAlign: 'center'}}>
              {selected} Đã chọn
            </BoxColor>} */}
          </div>
        ),
        dataIndex: 'shop_order_id',
        key: 'shop_order_id',
        width: '33%',
        className: 'order-custom',
        render: (text, record) => (
          <div className="customer-name">
            <div className="d-flex" style={{ alignItems: 'center' }}>
              <CustomLink to={`/orders/update/${record.id}`}>
                <CustomStyle color="#1976D2">
                  {!record.platform ? record.code : text || record.code}
                </CustomStyle>
              </CustomLink>
              <Tooltip
                visible={isShowCopyTitle && isShowCopy == record.code}
                placement="bottom"
                title="Copied"
                trigger="click"
                overlayInnerStyle={{
                  background: '#7e7575',
                  color: '#fff',
                  borderRadius: 20,
                }}
              >
                <div
                  className="icon-customer"
                  onClick={e => copyOrderCode(e, record)}
                >
                  <svg
                    width="13"
                    height="16"
                    viewBox="0 0 13 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9.66671 0.666672H1.66671C0.933374 0.666672 0.333374 1.26667 0.333374 2.00001V11.3333H1.66671V2.00001H9.66671V0.666672ZM11.6667 3.33334H4.33337C3.60004 3.33334 3.00004 3.93334 3.00004 4.66667V14C3.00004 14.7333 3.60004 15.3333 4.33337 15.3333H11.6667C12.4 15.3333 13 14.7333 13 14V4.66667C13 3.93334 12.4 3.33334 11.6667 3.33334ZM11.6667 14H4.33337V4.66667H11.6667V14Z"
                      fill="#6F8DAB"
                    />
                  </svg>
                </div>
              </Tooltip>
              <CustomStyle className="title-name">
                <svg
                  style={{ marginRight: 6 }}
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_3118_97389)">
                    <path
                      d="M6 4.875C7.24264 4.875 8.25 3.86764 8.25 2.625C8.25 1.38236 7.24264 0.375 6 0.375C4.75736 0.375 3.75 1.38236 3.75 2.625C3.75 3.86764 4.75736 4.875 6 4.875Z"
                      stroke="#BFBFBF"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M6 6.75C4.70707 6.75 3.46709 7.26361 2.55285 8.17785C1.63861 9.09209 1.125 10.3321 1.125 11.625H10.875C10.875 10.3321 10.3614 9.09209 9.44715 8.17785C8.53291 7.26361 7.29293 6.75 6 6.75V6.75Z"
                      stroke="#BFBFBF"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_3118_97389">
                      <rect width="12" height="12" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                {record.customer_full_name}
              </CustomStyle>
            </div>
            {record.platform == null && (
              <div className="box-custom">
                <div className="box-text">Đơn ngoại sàn</div>
              </div>
            )}
          </div>
        ),
      },
      {
        title: (
          <div className="custome-header">
            <div className="text-center title-box">
              <Tooltip title="Trạng thái đơn hàng">TT đơn hàng</Tooltip>
            </div>
          </div>
        ),
        className: 'order-custom',
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">
              <Tooltip title="Trạng thái xử lý đơn hàng">TT cung cấp</Tooltip>
            </div>
          </div>
        ),
        className: 'order-custom',
        width: '10%',
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">
              <Tooltip title="Tổng tiền Odii sẽ thanh toán cho nhà cung cấp">
                Thanh toán
              </Tooltip>
            </div>
          </div>
        ),
        className: 'order-custom',
        width: '10%',
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Cửa hàng</div>
          </div>
        ),
        className: 'order-store',
        width: '150px',
        render: (store, record) => (
          <div className="date-time">Ngày tạo đơn :</div>
        ),
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Thao tác</div>
          </div>
        ),
        dataIndex: 'store',
        key: 'store',
        width: '144px',
        className: 'order-custom',
        render: (store, record) => (
          <div className="order__create-time">
            {formatDateStr(record.created_at)}
          </div>
        ),
      },
    ],
    [tab, isShowCopyTitle, isShowCopy],
  );

  function formatDateStr(dateStr) {
    return moment(dateStr).format('HH:mm DD/MM/YYYY');
  }

  // const getRowAction = item => {
  //   //fulfillment status
  //   const pendingStatus = constants.ORDER_FULFILLMENT_STATUS.PENDING.id;
  //   const confirmedStatus =
  //     constants.ORDER_FULFILLMENT_STATUS.SELLER_CONFIRMED.id;

  //   if (item.is_map && item.fulfillment_status === confirmedStatus) {
  //     return (
  //       <Button
  //         context="secondary"
  //         className="btn-cancel btn-sm"
  //         color="red"
  //         onClick={handleRowAction(cancelAction, item)}
  //         width="80px"
  //       >
  //         Hủy bỏ
  //       </Button>
  //     );
  //   }

  //   if (item.is_map && item.fulfillment_status === pendingStatus) {
  //     return (
  //       <div>
  //         <Button
  //           context="secondary"
  //           color="orange"
  //           onClick={handleRowAction(ignoreAction, item)}
  //           className="btn-cancel btn-sm p-0"
  //           width="80px"
  //         >
  //           Bỏ qua
  //         </Button>
  //         <Button
  //           onClick={handleRowAction(confirmAction, item)}
  //           className="btn-sm p-0"
  //           width="80px"
  //         >
  //           Xác nhận
  //         </Button>
  //       </div>
  //     );
  //   }
  // };

  const toggleConfirmModal = order => {
    if (isShowConfirmStatus) {
      setActionType('');
      setDetail({});
    } else {
      loadOrderConfirmInfo(order);
    }
    setIsShowConfirmStatus(!isShowConfirmStatus);
  };

  const loadOrderConfirmInfo = async order => {
    setLoadingConfirm(true);
    const response = await request(
      `oms/seller/order/${order.id}/confirm-info`,
      {
        method: 'get',
      },
    );
    if (response.is_success) {
      setOrderConfirm(response.data);
    }
    setLoadingConfirm(false);
  };

  // const submitAction = () => {
  //   request(`oms/seller/orders/${detail.id}/change-fulfill-status`, {
  //     method: 'put',
  //     data: {
  //       fulfillment_status: actionType,
  //     },
  //   })
  //     .then(response => {
  //       notification(
  //         'success',
  //         `Order #${detail?.code} đã ${
  //           actionType === confirmAction
  //             ? 'được xác nhận'
  //             : actionType === cancelAction
  //             ? 'được hủy bỏ'
  //             : 'được bỏ qua'
  //         }!`,
  //         'Thành công!',
  //       );
  //       toggleConfirmModal();
  //       dispatch(
  //         actions.updateLists({
  //           id: detail.id,
  //           status: response.data.fulfillment_status,
  //         }),
  //       );
  //     })
  //     .catch(err => {
  //       const errorMessages = [
  //         {
  //           code: 'product_of_order_item_not_same_warehousing',
  //           title: 'Xác nhận không thành công!',
  //           message: `Số dư tài khoản của bạn không đủ.
  //         Vui lòng kiểm tra lại hoặc liên hệ với bộ phận cskh.`,
  //         },
  //       ];
  //       const errorCode = err?.data?.error_code;
  //       const currError = errorMessages.find(error => (error.code = errorCode));
  //       currError && notification('error', currError.message, currError.title);
  //     });
  // };

  const batchActionConfirmHandler = action => {
    let url = '';
    let payload = {};
    setConfirmModel(prev => ({ ...prev, loading: true }));
    if (action.id === 'seller_confirm') {
      url = `oms/seller/orders/change-fulfill-status`;
      payload.fulfillment_status = 'seller_confirmed';
      payload.ids = selectedOrders?.items
        .filter(item => item.actions.seller_confirm)
        .map(item => item.id);
    }
    if (url !== '') {
      request(url, {
        method: 'put',
        data: payload,
      })
        .then(response => {
          notification(
            'success',
            `${payload.ids.length} đơn hàng đã được xác nhận!`,
            'Thành công!',
          );
          setConfirmModel({ ...initConfirmModel });
          gotoPage('', true);
          dispatch(actions.setSelectedOrders([]));
          setSelectedRowsArray([]);
        })
        .catch(err => {
          const errorMessages = [
            {
              code: 'product_of_order_item_not_same_warehousing',
              title: 'Xác nhận không thành công!',
              message: `Số dư tài khoản của bạn không đủ.
          Vui lòng kiểm tra lại hoặc liên hệ với bộ phận cskh.`,
            },
          ];
          const errorCode = err?.data?.error_code;
          const currError = errorMessages.find(
            error => (error.code = errorCode),
          );
          currError &&
            notification('error', currError.message, currError.title);
        });
    }
  };

  const onCancelConfirmHandler = () => {
    setConfirmModel({ ...initConfirmModel });
  };

  const handleRowAction = (type, record) => () => {
    setActionType(type);
    setDetail(record);
    toggleConfirmModal(record);
  };
  const onBatchActionHandler = (type, items) => {
    if (type.id === 'seller_confirm') {
      setConfirmModel({ visible: true, loading: false, action: type });
    }
  };
  const goCreate = () => {
    history.push('orders/create');
  };

  const goImport = () => {
    history.push('orders/import');
  };

  const gotoPage = (data = '', isReload) => {
    // if (data && data.search) {
    //   console.log(data.search);
    //   data.search += isNotOdiiParam;
    // }
    const payloadData = { search: history.location.search };
    dispatch(actions.getData(isReload ? payloadData : data));
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
            Bạn có chắc chắn muốn hủy bỏ đơn hàng này<br></br>và Odii sẽ hoàn
            trả cho bạn <SpanPrice>{total_price}</SpanPrice>&nbsp; không?
          </span>
        );
      case ignoreAction:
        return <span>Bạn có chắc chắn muốn bỏ qua đơn hàng này không?</span>;
      default:
        return <span></span>;
    }
  };

  if (showEmptyPage) {
    return (
      <PageWrapper>
        <CustomStyle
          height="calc(100vh - 120px)"
          className="d-flex flex-column"
        >
          <CustomTitle>Đơn hàng</CustomTitle>
          <EmptyPage>
            <CustomStyle className="d-flex justify-content-center">
              {/* <Button
                className="btn-md"
                // width="152px"
                onClick={goCreate}
                context="secondary"
              >
                <img src={fileExcel} alt="" />
                &nbsp;Import đơn hàng
              </Button>
              <Button className="btn-md" onClick={goCreate}>
                + Thêm đơn hàng
              </Button> */}
              <Button
                className="btn-md"
                onClick={() => history.push('/orders/create')}
              >
                + Thêm đơn hàng
              </Button>
            </CustomStyle>
          </EmptyPage>
        </CustomStyle>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <CustomStyle className="d-flex justify-content-between">
        <CustomTitle>
          Đơn hàng
          <Tooltip
            placement="right"
            title="Tất cả đơn hàng từ cửa hàng kết nối sẽ đồng bộ ở đây. Không hỗ trợ xử lý đơn hàng có sản phẩm không được đẩy lên từ Odii"
          >
            <img
              className="tooltip"
              src={tooltip}
              alt=""
              style={{ marginLeft: '7px' }}
            />
          </Tooltip>
        </CustomTitle>
        <div className="btn-action-wrapper" style={{ display: 'flex' }}>
          {/* TODO: Tạm ẩn button Import đơn hàng do chưa xử lý */}
          {/* <Button context="secondary" className="btn-sm" onClick={goImport}>
            <i className="far fa-file-excel"></i>
            &nbsp;&nbsp;Import đơn hàng
          </Button> */}
          <Tooltip title="Thêm mới đơn hàng ngoại sàn Lazada, Shopee, Tiktok">
            <Button
              className="btn-sm"
              onClick={goCreate}
              style={{ marginLeft: '10px' }}
            >
              + Tạo đơn hàng
            </Button>
          </Tooltip>
        </div>
      </CustomStyle>
      {/* <CustomTabs onChange={handleChangeTab} activeKey={tab} animated={true}>
        {constants.TAB_PANEL.map( (item, index) => (
          <TabPane tab={item.name} key={index}></TabPane>
        ))}
      </CustomTabs> */}
      <SectionWrapperCustom className="">
        <CustomStyle className="title text-left" px={{ xs: 's6' }}>
          <FilterBar
            isLoading={isLoading}
            // gotoPage={gotoPage}
            history={history}
            listStores={listStores}
            summary={summary}
            tab={value => {
              if (value !== tab) {
                dispatch(actions.setSelectedOrders([]));
                setSelectedRowsArray([]);
              }
              setTab(value);
            }}
            batchActionHandler={onBatchActionHandler}
          />
        </CustomStyle>
        <Spin tip="Đang tải..." spinning={isLoading}>
          <Row gutter={24}>
            <Col span={24}>
              <TableWrapper>
                <Table
                  needObjectParams
                  className="order-tbl"
                  columns={columns}
                  rowSelection={rowSelection}
                  searchSchema={{
                    keyword: {
                      required: false,
                    },
                    platform: {
                      required: false,
                    },
                    status: {
                      required: false,
                    },
                    store_id: {
                      required: false,
                    },
                    from_date: {
                      required: false,
                    },
                    to_date: {
                      required: false,
                    },
                    odii_status: {
                      required: false,
                    },
                    fulfillment_status: {
                      required: false,
                    },
                  }}
                  expandable={{
                    expandedRowKeys: data.map(e => e.id),
                    expandedRowRender: record => {
                      return (
                        <TableOrder
                          data={record}
                          gotoPage={gotoPage}
                          history={history}
                          tab={tab}
                        />
                      );
                    },
                    expandIcon: ({ expanded, onExpand, record }) => <></>,
                  }}
                  data={{ data, pagination }}
                  scroll={{ x: 1100 }}
                  // rowClassName="pointer"
                  actions={gotoPage}
                  // onRow={record => ({
                  //   onClick: goDetail(record),
                  // })}
                />
              </TableWrapper>
            </Col>
          </Row>
        </Spin>
      </SectionWrapperCustom>
      {confirmModel.visible && (
        <Confirm
          isLoading={confirmModel.loading}
          isFullWidthBtn
          isModalVisible={confirmModel.visible}
          key={confirmModel.action.id}
          color={confirmModel.action.color}
          title={confirmModel.action.title}
          data={{
            message: confirmModel.action.confirm_message.replace(
              '{0}',
              selectedOrders?.metadata[confirmModel.action.count_name],
            ),
          }}
          // handleConfirm={submitAction}
          // handleCancel={toggleConfirmModal}
          handleConfirm={() => batchActionConfirmHandler(confirmModel.action)}
          handleCancel={onCancelConfirmHandler}
        />
      )}
    </PageWrapper>
  );
}

const TableWrapper = styled.div`
  table {
    .text-right {
      text-align: right;
    }
    .ant-table-thead > tr > th {
      border-bottom: 10px solid #f5f6fd;
      border-bottom-color: #f5f6fd !important;
    }
    .ant-table-row-expand-icon-cell {
      padding: 0 !important;
      width: 0%;
    }
    .ant-table-tbody {
      tr {
        td {
          padding: 12px 16px;
        }
      }
    }
    .ant-table-expanded-row {
      td {
        background: #fff;
      }
      .ant-table-cell {
        &:not(last-child) {
          border-bottom: 10px solid #f5f6fd;
        }
      }
    }
    tr {
      position: relative;
      /* display: unset; */

      th:last-child,
      .order-code {
        font-weight: 500;
      }
      .order-quantity,
      .th-number {
        text-align: right;
      }
      .order__create-time {
        font-size: 12px;
        color: ${({ theme }) => theme.gray3};
        margin-top: 2px;
      }
      .customer_address {
        font-size: 12px;
        color: ${({ theme }) => theme.gray3};
        white-space: nowrap;
        margin-top: 2px;
      }
      .order-status {
        width: unset;
        min-width: 110px;
      }
      .shop-status {
        text-align: center;
      }
      .fulfillment-status {
        padding-left: 0;
      }
      .total-price {
        font-size: 14px;
        padding-left: 20px !important;
        padding-right: 60px !important;
      }
      .order-store {
        min-width: 150px;
      }
      .store-info {
        display: inline-flex;
        position: relative;
        align-items: center;
        width: 100%;
      }
      .value-empty {
        color: #ccc;
      }
      .store-icon {
        width: 20px;
        border-radius: 100%;
        object-fit: cover;
        border: 1px solid #e1e1e1;
      }
      .store-name {
        margin-left: 7px;
      }
      .action-wrapper {
        display: none;
        position: absolute;
        padding: 0;
        top: 50%;
        right: 20px;
        transform: translateY(-50%);
        white-space: nowrap;
        word-break: keep-all;
        > div {
          display: inline-flex;
          > button {
            margin-left: 11px;
          }
        }
        .btn-cancel:not(:hover) {
          background: #fff;
        }
      }
    }
    tr:hover {
      .action-wrapper {
        display: inline-flex;
      }
    }
    .order-code {
      min-width: 120px;
    }
    &:hover .order-custom,
    &:hover .ant-table-selection-column,
    &:hover .order-store {
      background: #fff !important;
    }
    .order-custom,
    .ant-table-selection-column {
      padding: 8px 10px !important;

      .ant-checkbox-inner {
        border: 2px solid #d9d9d9;
      }
      .customer-name {
        display: flex;
        align-items: center;

        .title-name {
          border-left: 1px solid #d7d7d7;
          padding-left: 24px;
          font-size: 13px;
          line-height: 15px;
          align-items: center;
          display: flex;
          margin-left: 24px;
        }

        @media screen and (max-width: 1366px) {
          .title-name {
            padding-left: 10px;
            margin-left: 10px;
          }
        }

        .icon-customer {
          margin-left: 6px;
          cursor: pointer;
        }

        .box-custom {
          background: #f4f4f4;
          border-radius: 3px;
          padding: 4px 8px;
          text-align: right;
          margin-left: 10px;

          .box-text {
            font-size: 12px;
            color: #9d9d9d;
          }
        }
      }
    }
    .order-store {
      padding: 0 !important;
      .date-time {
        font-weight: 500;
        color: #757575;
        text-align: right;
      }
    }
  }
`;

const CustomLink = styled(Link)`
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  color: #333333;
`;

const SpanPrice = styled.span`
  color: orange;
  font-weight: bold;
`;
