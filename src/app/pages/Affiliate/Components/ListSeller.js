import React, { useMemo, useEffect, useState } from 'react';
import { Row, Col, Spin } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import {
  // Button,
  Table,
  BoxColor,
  EmptyPage,
  // Avatar,
} from 'app/components';
import { CustomTitle, CustomStyle } from 'styles/commons';
import { isEmpty } from 'lodash';
import styled from 'styled-components/macro';
import constants from 'assets/constants';
import {
  // selectLoading,
  // selectData,
  selectDataListSeller,
  selectPaginationListSeller,
  selectShowEmptyPageListSeller,
} from '../slice/selectors';
import { FilterBarListSeller } from '../Features';
import { useAffiliateSlice } from '../slice';
import { formatDate } from 'utils/helpers';
import { DEFAULT_FILTER } from '../Features/FilterBarListSeller';
// import moment from 'moment';

export default function ListSeller({ t, layout, history, isLoading }) {
  const dispatch = useDispatch();
  const { actions } = useAffiliateSlice();
  const pagination = useSelector(selectPaginationListSeller);
  const [filter, setFilter] = useState(DEFAULT_FILTER);
  const data = useSelector(selectDataListSeller);
  // const isLoading = useSelector(selectLoading);
  // const showEmptyPage = useSelector(selectShowEmptyPageListSeller);

  const updateFilter = data => {
    const values = {
      ...filter,
      ...data,
    };

    setFilter(values);
  };

  const fetchData = () => {
    const queryParams = Object.keys(filter).reduce((values, key) => {
      const value = filter[key];
      if (value !== '') {
        values.push(`${[key]}=${value}`);
      }
      return values;
    }, []);

    let querySearch = queryParams.join('&');
    querySearch = querySearch && `?${querySearch}`;

    dispatch(actions.getDataListSeller(querySearch));
  };

  useEffect(() => {
    fetchData();
  }, [filter]);

  // const handleStatus = expiry_at => {
  //   if (moment().isAfter(expiry_at, 'day')) {
  //     return 'expired';
  //   } else return 'active';
  // };

  const columns = useMemo(
    () => [
      {
        title: 'STT',
        width: 20,
        render: (_, v, i) => i + 1,
      },
      {
        title: 'ID',
        dataIndex: 'user_id',
        key: 'user_id',
        width: 40,
        render: (text, record) => {
          return <div>{text}</div>;
        },
      },
      {
        title: 'Tên người đăng ký',
        dataIndex: 'full_name',
        key: 'full_name',
        width: 100,
        render: text => {
          return (
            <div
              style={{
                fontWeight: '500',
              }}
            >
              {text}
            </div>
          );
        },
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        width: 100,
        render: text => {
          return (
            <div>
              {'*******' +
                text?.slice(0, text.indexOf('@')).slice(-3) +
                text?.slice(text.indexOf('@'))}
            </div>
          );
        },
      },

      {
        title: 'SĐT',
        dataIndex: 'phone',
        key: 'phone',
        width: 100,
        render: text => {
          return (
            text && <div>{text?.slice(0, 3) + '****' + text?.slice(-2)}</div>
          );
        },
      },
      {
        title: 'Ngày tham gia',
        dataIndex: 'created_at',
        key: 'created_at',
        width: 160,
        render: text => {
          return (
            <div style={{ fontSize: '14px', color: '#828282' }}>
              {formatDate(text)}
            </div>
          );
        },
      },
      // {
      //   title: 'Ngày hết hạn',
      //   dataIndex: 'partner_affiliate_expiry_date',
      //   key: 'partner_affiliate_expiry_date',
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
      //   title: 'Trạng thái tiếp thị',
      //   width: 160,
      //   align: 'center',
      //   render: (_, record) => {
      //     const currentStatus = constants.AFFILIATE_STATUS.find(
      //       v => v.id === handleStatus(record.partner_affiliate_expiry_date),
      //     );
      //     return (
      //       <>
      //         {isEmpty(currentStatus) || (
      //           <BoxColor colorValue={currentStatus?.color} width="120px">
      //             {currentStatus?.name}
      //           </BoxColor>
      //         )}
      //         {/* <div className="action-wrapper">{getRowAction(record)}</div> */}
      //       </>
      //     );
      //   },
      // },
      {
        title: 'Trạng thái tài khoản',
        dataIndex: 'status',
        key: 'status',
        width: 160,
        align: 'center',
        render: (text, record) => {
          const currentStatus = constants.ACCOUNT_STATUS.find(
            v => v.id === text,
          );
          return (
            <>
              {isEmpty(currentStatus) || (
                <BoxColor colorValue={currentStatus?.color} width="120px">
                  {currentStatus?.name}
                </BoxColor>
              )}
              {/* <div className="action-wrapper">{getRowAction(record)}</div> */}
            </>
          );
        },
      },
    ],
    [],
  );

  const onChangeTable = pagination => {
    updateFilter({ page: pagination.current });
  };

  // const getRowAction = record => {
  //   return (
  //     <>
  //       <Button
  //         color="blue"
  //         className="btn-sm btn-action"
  //         // onClick={() =>
  //         //   history.push(`/notification-system/${record.id}/detail`)
  //         // }
  //       >
  //         Chi tiết
  //       </Button>
  //     </>
  //   );
  // };

  const pageContent = (
    <>
      <CustomStyle mb={{ xs: 's5' }}>
        <FilterBarListSeller
          filter={filter}
          updateFilter={updateFilter}
          isLoading={isLoading}
          // gotoPage={gotoPage}
        />
      </CustomStyle>
      <Spin tip="Đang tải..." spinning={isLoading}>
        <Row gutter={24}>
          <Col span={24}>
            <TableWrapper>
              <Table
                className="table-custom"
                columns={columns}
                // searchSchema={{
                //   keyword: {
                //     required: false,
                //   },
                //   register_from: {
                //     required: false,
                //   },
                //   register_to: {
                //     required: false,
                //   },
                //   // affiliate_status: {
                //   //   required: false,
                //   // },
                //   account_status: {
                //     required: false,
                //   },
                // }}
                notNeedRedirect={true}
                data={{ data }}
                scroll={{ x: 1100, y: 5000 }}
                // actions={gotoPage}
                onChange={onChangeTable}
                rowKey={record => record.id}
                pagination={{
                  showSizeChanger: false,
                  // defaultCurrent: pagination.page,
                  // hideOnSinglePage: true,
                  pageSize: pagination?.page_size || 1,
                  total: pagination.total ?? 0,
                  showTotal: total => <b>Hiển thị {total} trên tổng 10</b>,
                }}
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
