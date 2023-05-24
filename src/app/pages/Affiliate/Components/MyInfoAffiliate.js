import React, { useEffect, useState } from 'react';
import { Row, Col, notification, Tooltip } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'app/components';
import { CustomH3, CustomStyle, SectionWrapper } from 'styles/commons';
import { isEmpty } from 'lodash';
import styled from 'styled-components/macro';
import { CopyOutlined } from '@ant-design/icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {
  selectDataAffiliateCode,
  selectDataStatisticalAffiliate,
} from '../slice/selectors';
import { useAffiliateSlice } from '../slice';
import { renderLinkAffiliate } from 'utils/affiliate';
import { ModalInfoAffiliateProgram } from '.';
import { formatMoney } from 'utils/helpers';
import {
  // totalDeposit,
  // totalWithdrawal,
  people,
  boxCheck,
  totalMoney,
  totalOrder,
  tooltip,
} from 'assets/images/dashboards';

const dataOverViewAffiliate = [
  {
    count: true,
    icon: people,
    title: 'Tổng số seller đã ĐK',
    hint: 'Tổng số seller đã đăng ký thông qua mã giới thiệu của bạn',
    total: 'number_of_Affs',
    // growth: 'deposit_amount',
  },
  {
    // count: true,
    icon: totalOrder,
    title: 'Tổng giá trị đơn hàng',
    hint: 'Tổng giá trị đơn hàng mà seller đã bán được',
    total: 'order_total_price',
    // growth: 'deposit_amount',
  },
  {
    icon: totalMoney,
    title: 'Tổng tiền hoa hồng',
    hint: 'Tổng tiền hoa hồng được nhận theo % giá trị đơn hàng',
    total: 'total_commissions',
  },
  {
    icon: boxCheck,
    title: 'Tổng tiền chưa thanh toán',
    hint: 'Tổng tiền hoa hồng đang chờ được thanh toán theo thời gian quy định',
    total: 'total_unpaid_commissions',
  },
];

export default function MyInfoAffiliate({
  data,
  t,
  layout,
  history,
  isLoading,
}) {
  const dispatch = useDispatch();
  const { actions } = useAffiliateSlice();

  const dataAffiliateCode = useSelector(selectDataAffiliateCode);
  const dataStatisticalAffiliate = useSelector(selectDataStatisticalAffiliate);

  const [affiliateLink, setAffiliateLink] = useState('');
  const [
    isShowModalInfoAffiliateProgram,
    setIsShowModalInfoAffiliateProgram,
  ] = useState(false);

  useEffect(() => {
    dispatch(actions.getDataAffiliateCode({}));
    dispatch(actions.getDataStatisticalAffiliate({}));
  }, []);
  useEffect(() => {
    if (!isEmpty(dataAffiliateCode)) {
      setAffiliateLink(
        renderLinkAffiliate(dataAffiliateCode?.own_affiliate_code),
      );
    }
  }, [dataAffiliateCode]);

  const copyToClipboard = values => {
    const content = {
      message: 'Copy thành công !',
      description: 'Nội dung: ' + values,
      duration: 2,
    };
    notification.open(content);
  };

  const pageContent = (
    <>
      <Row gutter={[8, 8]}>
        <Col xs={24} md={18}>
          <CustomH3 mb={{ xs: 's6' }}>
            Tiếp thị đối tác bán hàng - ngập tràn ưu đãi với chương trình
            Aaffiliate
            {/* (15/01/2022 - 15/12/2022) */}
          </CustomH3>
          <div className="affiliate-method">
            Mã giới thiệu của bạn:{' '}
            {dataAffiliateCode?.is_verified ? (
              <>
                <span className="my-affiliate-code">
                  {dataAffiliateCode?.own_affiliate_code}
                </span>
                <CopyToClipboard text={dataAffiliateCode?.own_affiliate_code}>
                  <button
                    className="btn-copy"
                    onClick={() =>
                      copyToClipboard(dataAffiliateCode?.own_affiliate_code)
                    }
                  >
                    <CopyOutlined />
                  </button>
                </CopyToClipboard>
              </>
            ) : (
              <span className="my-affiliate-code">
                Hãy xác nhận tham gia để lấy mã giới thiệu của bạn
              </span>
            )}
          </div>
          <div className="affiliate-method">
            Đường dẫn đăng ký: &ensp;&ensp;&ensp;
            {dataAffiliateCode?.is_verified ? (
              <>
                <span className="my-affiliate-link">{affiliateLink}</span>
                <CopyToClipboard text={affiliateLink}>
                  <button
                    className="btn-copy"
                    onClick={() => copyToClipboard(affiliateLink)}
                  >
                    <CopyOutlined />
                  </button>
                </CopyToClipboard>
              </>
            ) : (
              <span className="my-affiliate-link">
                Hãy xác nhận tham gia để lấy đường dẫn tiếp thị
              </span>
            )}
          </div>
        </Col>
        <Col xs={24} flex="auto">
          <div className="btn-dk">
            <Button
              context="secondary"
              color="blue"
              // color="default"
              className="btn-sm"
              onClick={() => setIsShowModalInfoAffiliateProgram(true)}
            >
              Chi tiết chương trình
            </Button>
          </div>
        </Col>
      </Row>
      <CustomDivOverViewAffiliate>
        <Row gutter={[8, 8]}>
          {dataOverViewAffiliate.map(item => (
            <Col xs={24} lg={6}>
              {item.icon && (
                <div className="item">
                  <div className="box-icon" marginRight={{ xs: 's4' }}>
                    <img src={item.icon} alt="" />
                  </div>
                  <CustomStyle
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-between"
                  >
                    <CustomStyle color="#828282" fontWeight={400}>
                      {item.title}
                      <Tooltip placement="right" title={item.hint}>
                        <img className="tooltip" src={tooltip} alt="" />
                      </Tooltip>
                    </CustomStyle>
                    <CustomStyle display="flex">
                      <span className="number">
                        {/* {!isEmpty(dataStatisticalAffiliate)
                          ? item?.count
                            ? dataStatisticalAffiliate[item?.total]
                            : formatMoney(dataStatisticalAffiliate[item?.total])
                          : '0'} */}
                        {!isEmpty(dataStatisticalAffiliate) &&
                          (item?.count
                            ? dataStatisticalAffiliate[item?.total]
                            : formatMoney(
                                dataStatisticalAffiliate[item?.total],
                              ))}
                      </span>
                      {/* <span className="growth-period">
                        So với cùng kỳ{' '}
                        <span
                          style={{ color: 'green' }}
                          //  color={ ? 'green' : 'red'}
                        >
                          +5%
                        </span>
                      </span> */}
                    </CustomStyle>
                  </CustomStyle>
                </div>
              )}
            </Col>
          ))}
        </Row>
      </CustomDivOverViewAffiliate>

      <ModalInfoAffiliateProgram
        layout={layout}
        dataAffiliateCode={dataAffiliateCode}
        isShowModalInfoAffiliateProgram={isShowModalInfoAffiliateProgram}
        setIsShowModalInfoAffiliateProgram={setIsShowModalInfoAffiliateProgram}
      />
    </>
  );

  return <CustomSectionWrapper>{pageContent}</CustomSectionWrapper>;
}

const CustomSectionWrapper = styled(SectionWrapper)`
  .affiliate-method {
    font-size: 12px;
    line-height: 20px;
    letter-spacing: 0.03em;
    color: #6c798f;
    &::before {
      content: ' ';
      margin-right: 8px;
      height: 4px;
      width: 4px;
      vertical-align: middle;
      background-color: #6c798f;
      border-radius: 50%;
      display: inline-block;
    }
    .my-affiliate-code {
      font-weight: bold;
      margin-left: 8px;
    }
    .my-affiliate-link {
      color: #1078cd;
    }
    .btn-copy {
      background: white;
      padding: 0 8px;
      border-radius: 0px 4px 4px 0px;
      outline: none;
      border: none;

      :hover {
        cursor: pointer;
      }
      .anticon-copy {
        vertical-align: 0;
      }
    }
  }
  .btn-dk {
    display: flex;
    justify-content: flex-end;
    position: relative;
    top: 50%;
    transform: translateY(-50%);
  }
`;

const CustomDivOverViewAffiliate = styled.div`
  padding-top: 20px;
  margin-top: 30px;
  border-top: 1px solid #ebebf0;
  .tooltip {
    margin-left: 6px;
    margin-bottom: 6px;
  }
  .item {
    display: flex;
  }
  .number {
    line-height: 21px;
    font-size: 22px;
    margin-right: 6px;
    font-weight: 900;
  }
  .ant-row {
    .ant-col:not(:last-child) {
      .item {
        border-right: 1px solid ${({ theme }) => theme.stroke};
      }
    }
    .ant-col:nth-child(2),
    .ant-col:nth-child(3) {
      .item {
        justify-content: center;
      }
    }
    .ant-col:last-child {
      .item {
        justify-content: end;
      }
    }
  }
  .box-icon {
    width: 50px;
    height: 50px;
    padding: 14px;
    background: #ffffff;
    border: 1px solid #ebebf0;
    border-radius: 10px;
    margin-right: 12px;
    img {
      width: 20px;
      height: 20px;
    }
  }
  .growth-period {
    font-size: 12px;
    line-height: 14px;
    color: #828282;
    align-self: end;
  }
`;
