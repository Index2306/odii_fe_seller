import React, { useMemo, useState } from 'react';
import { Row, Col, Spin } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import {
  Button,
  Table,
  EmptyPage,
  BoxColor,
  // Avatar,
  Link,
} from 'app/components';
import { CustomTitle, CustomStyle } from 'styles/commons';
// import { isEmpty } from 'lodash';
import styled from 'styled-components/macro';
import {
  // selectLoading,
  // selectData,
  selectDataListCommission,
  selectPaginationListCommission,
  selectShowEmptyPageCommission,
} from '../slice/selectors';
import { FilterBarCommission } from '../Features';
import { useAffiliateSlice } from '../slice';
import { formatDate, formatVND } from 'utils/helpers';
import constants from 'assets/constants';

export default function ListCommission({ t, layout, history, isLoading }) {
  const dispatch = useDispatch();
  const { actions } = useAffiliateSlice();
  const pagination = useSelector(selectPaginationListCommission);
  const data = useSelector(selectDataListCommission);
  // const isLoading = useSelector(selectLoading);
  const showEmptyPage = useSelector(selectShowEmptyPageCommission);

  const gotoPage = (data = '', isReload) => {
    dispatch(
      actions.getDataListCommission(isReload ? history.location.search : data),
    );
  };

  const columns = useMemo(
    () => [
      {
        title: 'STT',
        width: 40,
        render: (_, v, i) => i + 1,
      },
      {
        title: 'ID Seller',
        dataIndex: 'user_id',
        key: 'user_id',
        width: 50,
        render: (text, record) => {
          return <div>{text}</div>;
        },
      },
      {
        title: 'ID Đơn hàng',
        width: 120,
        render: (text, record) => {
          return (
            <CustomLink to={`/orders/update/${record.order_id}`}>
              <CustomStyle color="#1976D2">{`#${
                record.shop_order_id || record.code
              }`}</CustomStyle>
            </CustomLink>
          );
        },
      },
      {
        title: 'Thời gian tạo đơn hàng',
        width: 140,
        render: (text, record) => {
          return (
            <div style={{ fontSize: '14px', color: '#828282' }}>
              {formatDate(record.order_created_at)}
            </div>
          );
        },
      },
      {
        title: 'Thời gian hoàn thành ĐH',
        dataIndex: 'created_at',
        key: 'created_at',
        width: 140,
        render: (text, record) => {
          return (
            <div style={{ fontSize: '14px', color: '#828282' }}>
              {formatDate(text)}
            </div>
          );
        },
      },
      {
        title: 'Giá trị đơn hàng',
        width: 120,
        render: (text, record) => (
          <div>{formatVND(record.order_total_price)} đ</div>
        ),
        // </div>
      },
      // {
      //   title: 'Ngày hết hạn',
      //   dataIndex: 'expired_at',
      //   key: 'expired_at',
      //   width: 160,
      //   render: text => {
      //     return (
      //       <div style={{ fontSize: '14px', color: '#828282' }}>
      //         {formatDate(text)}
      //       </div>
      //     );
      //   },
      // },
      // {
      //   title: 'Nội dung thông báo',
      //   dataIndex: 'content',
      //   key: 'content',
      //   width: 200,
      //   render: text => {
      //     return (
      //       <>
      //         {text?.slice(0, 1).toUpperCase() +
      //           text?.slice(1, 40) +
      //           (text?.length > 40 ? '...' : '')}
      //       </>
      //     );
      //   },
      // },
      {
        title: 'Tỷ lệ hoa hồng',
        width: 100,
        render: (text, record) => (
          <div style={{ fontWeight: 'bold' }}>
            {record.affiliate_commission_percent} %
          </div>
        ),
      },
      {
        title: 'Hoa hồng được nhận',
        dataIndex: 'commission',
        key: 'commission',
        width: 120,
        render: text => (
          // <div style={{ fontSize: '14px', color: '#828282' }}>
          /* {formatDate(text)} */
          <div style={{ color: 'rgb(39, 174, 96)' }}>{formatVND(text)} đ</div>
        ),
        // </div>
      },
      {
        title: 'Trạng thái',
        dataIndex: 'isPaid',
        key: 'isPaid',
        width: 120,
        align: 'center',
        render: (text, record) => {
          const currentStatus = constants.AFFILIATE_PAY_STATUS.find(
            v => v.id === text,
          );
          return (
            <>
              <BoxColor colorValue={currentStatus?.color} width="120px">
                {currentStatus?.name}
              </BoxColor>
            </>
          );
        },
      },
      // {
      //   title: '',
      //   width: 160,
      //   align: 'center',
      //   render: (text, record) => {
      //     return (
      //       <>
      //         <Button
      //           color="blue"
      //           className="btn-sm btn-action"
      //           // onClick={() =>
      //           //   history.push(`/notification-system/${record.id}/detail`)
      //           // }
      //         >
      //           Chi tiết
      //         </Button>
      //       </>
      //     );
      //   },
      // },
    ],
    [],
  );

  const pageContent = (
    <>
      <CustomStyle mb={{ xs: 's5' }}>
        <FilterBarCommission isLoading={isLoading} gotoPage={gotoPage} />
      </CustomStyle>
      <Spin tip="Đang tải..." spinning={isLoading}>
        <Row gutter={24}>
          <Col span={24}>
            <TableWrapper>
              <Table
                className="table-custom"
                actions={gotoPage}
                columns={columns}
                searchSchema={{
                  keyword: {
                    required: false,
                  },
                  // from_time: {
                  //   required: false,
                  // },
                  // to_time: {
                  //   required: false,
                  // },
                  from_date: {
                    required: false,
                  },
                  to_date: {
                    required: false,
                  },
                  payout_affiliate_key: {
                    required: false,
                  },
                }}
                data={{ data, pagination }}
                scroll={{ x: 1100, y: 5000 }}
                rowKey={record => record.id}
              />
            </TableWrapper>
          </Col>
        </Row>
      </Spin>
    </>
  );

  // if (showEmptyPage) {
  //   return (
  //     <>
  //       <CustomTitle
  //         height="calc(100vh - 120px)"
  //         className="d-flex flex-column"
  //       >
  //         <EmptyPage />
  //       </CustomTitle>
  //     </>
  //   );
  // }
  return <>{pageContent}</>;
}

const TableWrapper = styled.div`
  .anticon {
    vertical-align: 0;
    /* cursor: pointer; */
  }
  .display-none {
    display: none;
  }
  table {
    .text-right {
      text-align: right;
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
      .order-status {
        width: unset;
        min-width: 130px;
        text-align: center;
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
        left: 0;
        right: 0;
        transform: translateY(-50%);
        white-space: nowrap;
        word-break: keep-all;
        > div {
          display: inline-flex;
          > button {
            margin-left: 11px;
          }
        }
        .btn-cancel {
          background: #fff;
          &:hover {
            color: #fff;
            background: red;
          }
        }
        .btn-action {
          margin: auto;
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
  }
`;
const CustomLink = styled(Link)`
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  color: #333333;
`;
