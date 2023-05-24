import React, { useEffect } from 'react';
import { Row, Col } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { Table, BoxColor, Button, Link } from 'app/components';
// import { isEmpty } from 'lodash';
import { useMyWalletSlice } from '../slice';
// import styled from 'styled-components/macro';
import { selectPagination } from '../slice/selectors';
import { formatMoney, formatDate } from 'utils/helpers';
import { CustomH3, CustomStyle } from 'styles/commons';
import { messages } from '../messages';
import { FilterBar } from '../Features';
import constants from 'assets/constants';

export default function HistoryTransaction({ data, t, history, isLoading }) {
  const dispatch = useDispatch();
  const { actions } = useMyWalletSlice();
  const pagination = useSelector(selectPagination);

  const gotoPage = (data = '', isReload) => {
    dispatch(actions.getData(isReload ? history.location.search : data));
  };

  useEffect(() => {
    const delaySecond = 10000;
    let reloadPageInterval;
    let reloadPageTimeout;
    reloadPageTimeout = setTimeout(() => {
      reloadPageInterval = setInterval(() => {
        gotoPage('', true);
      }, delaySecond);
    }, delaySecond);
    return () => {
      clearInterval(reloadPageInterval);
      clearTimeout(reloadPageTimeout);
    };
  }, []);

  const handleDelete = record => {
    dispatch(
      actions.deleteTransaction({
        id: record?.id,
        data: {
          is_delete: true,
        },
      }),
    );
  };

  const goSetStatusPending = record => {
    dispatch(
      actions.setStatusPendingList({
        id: record?.id,
        data: {},
      }),
    );
  };

  const columns = React.useMemo(
    () => [
      {
        title: (
          <div className="custome-header">
            <div className="title-box">ID</div>
          </div>
        ),
        width: 160,
        render: (_, record) => (
          <>
            <Link
              to={`/mywallet/${record.id}/detail`}
              style={{ fontWeight: '500', margin: '0', color: '#000' }}
            >
              #{record?.long_code}
            </Link>
            <div style={{ fontSize: '12px', color: '#828282' }}>
              {formatDate(record?.created_at)}
            </div>
          </>
        ),
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Loại giao dịch</div>
          </div>
        ),
        dataIndex: 'action_type',
        key: 'action_type',
        width: 140,
        render: (text, record) => {
          return (
            <div
              style={{
                fontWeight: '500',
                color:
                  text === 'deposit'
                    ? 'green'
                    : text === 'withdrawal'
                    ? 'red'
                    : text === 'confirmed_order'
                    ? 'red'
                    : '#5573e0',
              }}
            >
              {t(`mywallet.transaction_action_type.${text}`)}
            </div>
          );
        },
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Biến động</div>
          </div>
        ),
        dataIndex: 'amount',
        key: 'amount',
        width: 120,
        // align: 'end',
        render: (text, record) => {
          return (
            <div
              style={{
                color: record?.type === 'deposit' ? 'green' : 'red',
              }}
            >
              {record?.type === 'deposit' ? '+' : '-'} &nbsp;
              {formatMoney(Math.abs(text))}
            </div>
          );
        },
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Số dư</div>
          </div>
        ),
        dataIndex: 'balance_amount',
        key: 'balance_amount',
        width: 120,
        render: (text, record) => {
          return (
            <div>
              {record.method === 'debt' ? '-' : formatMoney(Math.abs(text))}
            </div>
          );
        },
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Hình thức</div>
          </div>
        ),
        dataIndex: 'method',
        key: 'method',
        width: 160,
        render: text => {
          return <div>{text ? t(`mywallet.transaction.${text}`) : '-'}</div>;
        },
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Nội dung</div>
          </div>
        ),
        dataIndex: 'note',
        key: 'note',
        width: 200,
        render: (text, record) => {
          return record?.confirm_status === 'chief_accountant_rejected' &&
            record?.confirm_status === 'accountant_rejected' ? (
            <div>{text}</div>
          ) : (
            <>
              <div>
                {record?.action_type
                  ? t(`mywallet.action_type.${record?.action_type}`)
                  : ''}
                .
              </div>
              {record?.short_code ? (
                <div className="d-flex">
                  Mã GD :&nbsp;
                  <div style={{ fontWeight: 'bold' }}>{record?.short_code}</div>
                </div>
              ) : (
                ''
              )}
            </>
          );
        },
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Trạng thái</div>
          </div>
        ),
        dataIndex: 'confirm_status',
        key: 'confirm_status',
        // dataIndex: 'status',
        // key: 'status',
        width: 160,
        align: 'center',
        render: (text, record) => {
          if (
            record.action_type === 'deposit' ||
            record.action_type === 'withdrawal'
          ) {
            const currentStatus = constants.MYWALLET_STATUS.find(
              v => v.id === text,
            );
            return (
              <>
                <BoxColor colorValue={currentStatus?.color}>
                  {currentStatus?.name || ''}
                </BoxColor>
                <div className="action-wrapper">{getRowAction(record)}</div>
              </>
            );
          } else {
            const currentStatus = constants.MYWALLET_STATUS.find(
              v => v.id === record.status,
            );
            return (
              <>
                <BoxColor colorValue={currentStatus?.color}>
                  {currentStatus?.name || ''}
                </BoxColor>
              </>
            );
          }
        },
      },
    ],
    [data],
  );

  const getRowAction = record => {
    return (
      <div className={record.status === 'created' ? '' : 'hide'}>
        <Button
          context="secondary"
          color="orange"
          className="btn-sm"
          onClick={() => handleDelete(record)}
        >
          Xóa
        </Button>
        <Button
          color="blue"
          className="btn-sm"
          onClick={() => goSetStatusPending(record)}
        >
          {record.type === 'withdrawal' ? 'Tiếp tục rút' : 'Đã chuyển tiền'}
        </Button>
      </div>
    );
  };

  const pageContent = (
    <>
      <div className="header">
        <CustomH3 className="title text-left" mb={{ xs: 's6' }}>
          {t(messages.list())}
        </CustomH3>
      </div>
      <CustomStyle mb={{ xs: 's5' }}>
        <FilterBar
          isLoading={isLoading}
          gotoPage={gotoPage}
          history={history}
        />
      </CustomStyle>
      <Row gutter={24}>
        <Col span={24}>
          <div>
            <Table
              className="custom"
              columns={columns}
              searchSchema={{
                keyword: {
                  required: false,
                },
                confirm_status: {
                  required: false,
                },
                action_type: {
                  required: false,
                },
                from_time: {
                  required: false,
                },
                to_time: {
                  required: false,
                },
              }}
              data={{ data, pagination }}
              scroll={{ x: 1100, y: 1000 }}
              actions={gotoPage}
              rowKey={record => record.id}
              // onRow={record => ({
              //   onClick: () =>
              //     (window.location.href = `/mywallet/${record.id}/detail`),
              // })}
            />
          </div>
        </Col>
      </Row>
    </>
  );

  return <>{pageContent}</>;
}
