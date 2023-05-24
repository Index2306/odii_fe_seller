import React, { memo } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { formatDateRange } from 'utils/helpers';
import { CustomStyle } from 'styles/commons';
import {
  invert,
  modeborder,
  tooltip,
  totalAdd,
  totalMode,
} from 'assets/images/dashboards';
import { Row, Tooltip } from 'antd';
import { formatMoney } from 'utils/helpers';
import { ArrowRightOutlined, RightOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useMyWalletSlice } from 'app/pages/MyWallet/slice';
import {
  selectDataBalance,
  selectDataNearest,
} from 'app/pages/MyWallet/slice/selectors';
import moment from 'moment';

const dataBalanceInit = [
  {
    label: 'Số dư khả dụng',
    total: 'amount',
    icon: modeborder,
    tooltip: '',
    money: true,
    textColor: ' #3D56A6',
    cycle: '',
  },
  {
    label: 'Tổng tiền đã nạp',
    total: 'deposit_amount',
    icon: totalAdd,
    tooltip: '',
    money: true,
    cycle: 'balance_deposit',
  },
  {
    label: 'Tổng tiền đã rút',
    total: 'withdrawal_amount',
    icon: totalMode,
    tooltip: '',
    money: true,
    cycle: 'balance_withdrawal',
  },
  {
    label: 'Tổng tiền Odii hoàn trả',
    total: 'payout_prev_period',
    icon: invert,
    tooltip: '',
    money: true,
    cycle: '',
  },
];

export default memo(function PayBox() {
  const dispatch = useDispatch();
  const { actions } = useMyWalletSlice();
  const dataBalance = useSelector(selectDataBalance);
  const dataNearest = useSelector(selectDataNearest);

  React.useEffect(() => {
    fetchOverviewStats();
  }, []);

  const fetchOverviewStats = () => {
    dispatch(actions.getBalance({}));
  };

  const convertData = React.useMemo(
    () => [
      {
        amount: dataBalance?.amount,
        deposit_amount: dataBalance?.deposit_amount,
        withdrawal_amount: dataBalance?.withdrawal_amount,
      },
    ],
    [dataBalance],
  );

  return (
    <CustomPay>
      <CustomStyle
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        className="header"
      >
        <CustomStyle className="title">Ví của tôi</CustomStyle>
        <CustomStyle className="see-more">
          <Link to={'/mywallet?page=1'} style={{ color: '#3d56a6' }}>
            Xem thêm
          </Link>
          <RightOutlined style={{ marginLeft: 5 }} />
        </CustomStyle>
      </CustomStyle>
      <Row className="content" justify="space-between">
        {dataBalanceInit.map((fieldInfo, index) => (
          <CustomStyle className="box">
            <CustomStyle className="item">
              <CustomStyle className="header-icon">
                <img src={fieldInfo.icon} alt="" />
                {/* <ArrowRightOutlined style={{ color: '#3D56A6' }} /> */}
              </CustomStyle>
              <CustomStyle className="header">
                {fieldInfo.label}
                {fieldInfo.tooltip && (
                  <Tooltip placement="right" title={fieldInfo.tooltip}>
                    <img className="tooltip" src={tooltip} alt="" />
                  </Tooltip>
                )}
              </CustomStyle>
              <CustomStyle
                className="total"
                style={{ color: `${fieldInfo.textColor || fieldInfo.color}` }}
              >
                {fieldInfo.money
                  ? formatMoney(convertData[0][fieldInfo.total] || 0)
                  : convertData[0][fieldInfo.total] || 0}
              </CustomStyle>
              {index !== 0 && (
                <CustomStyle
                  className="note"
                  style={{ justifyContent: 'normal' }}
                >
                  Gần nhất:
                  <span>
                    {(fieldInfo.cycle &&
                      formatMoney(
                        Math.abs(dataNearest?.[fieldInfo.cycle]?.amount || 0),
                      ) +
                        ' - ' +
                        moment(
                          dataNearest?.[fieldInfo.cycle]?.created_at,
                        ).format('DD/MM/YYYY')) ||
                      'Không có giao dịch nào'}
                  </span>
                  <CustomStyle
                    className="text"
                    style={{ color: '#828282', marginLeft: '8px' }}
                  >
                    {/* {convertData[0][fieldInfo.total]} */}
                  </CustomStyle>
                </CustomStyle>
              )}
            </CustomStyle>
          </CustomStyle>
        ))}
      </Row>
    </CustomPay>
  );
});

const CustomPay = styled.div`
  margin-bottom: 24px;

  .title {
    color: #333333;
    font-weight: 500;
    font-size: 18px;
    line-height: 21px;
    margin-bottom: 16px;
  }
  .see-more {
    display: flex;
    align-items: center;
    color: #3d56a6;

    &:hover {
      cursor: pointer;
      text-decoration: underline;
    }
  }
  .content {
    .box {
      border: 1px solid #efefef;
      box-shadow: 0px 4px 4px rgba(183, 183, 183, 0.25);
      border-radius: 6px;
      width: 240px;
      height: 143px;

      .header-icon {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 16px;
      }
    }
    .item {
      background: #fff;
      width: 100%;
      height: 100%;
      padding: 20px 0px 20px 20px;

      .header {
        font-weight: 500;
        font-size: 14px;
        line-height: 16px;
        color: #333333;

        .tooltip {
          cursor: pointer;
          margin-left: 6px;
        }
      }

      .total {
        font-weight: 500;
        font-size: 18px;
        line-height: 21px;
        letter-spacing: 0.01em;
        margin-top: 6px;
      }

      .note {
        font-weight: 400;
        font-size: 12px;
        line-height: 18px;
        color: #828282;
        margin-top: 8px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .text {
          display: flex;
          align-items: center;

          .icon {
            width: 14px !important;
          }
          .rotate {
            transform: rotate(-180deg);
          }
        }

        span {
          margin-left: 4px;
        }
      }
    }
  }
`;
