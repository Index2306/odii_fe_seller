import React, { memo } from 'react';
import { CustomStyle } from 'styles/commons';
import styled from 'styled-components';
import { Button } from 'app/components';

// import moment from 'moment';
import { iconOdii, shopee, warehouse, product } from 'assets/images/icons';
import { Image, Tabs } from 'app/components';
import { Col, Row, Tooltip } from 'antd';
import Color from 'color';
import { defaultImage } from 'assets/images';
const { TabPane } = Tabs;

export default memo(function StoreInfo({
  detail = {},
  handleChangeTab,
  tab,
  onSyncAddress,
}) {
  const {
    logo,
    name,
    platform_email,
    number_of_order,
    number_of_product,
    rating,
    number_of_rating,
    number_of_product_platform,
    follow,
    full_address,
    full_address_return,
  } = detail;
  return (
    <Wrapper>
      <BodyWrapper>
        <Row gutter={10}>
          <Col lg={7} xxl={6}>
            <WrapperItemLeft display="flex">
              <CustomImage size="60x60" src={logo || defaultImage} />
              <CustomStyle color="whitePrimary" ml={{ xs: 's7' }}>
                <CustomStyle
                  fontWeight="medium"
                  fontSize={{ xs: 'f2' }}
                  mb={{ xs: 's3' }}
                >
                  {name}
                </CustomStyle>

                <CustomStyle opacity={0.5} mr={{ xs: 's5' }}>
                  {platform_email}
                </CustomStyle>
                {/* <CustomStyle display="flex">
                  <CustomStyle opacity={0.5} mr={{ xs: 's5' }}>
                    Kho hàng:
                  </CustomStyle>
                  {supplier_warehousing_data?.length ?? 0}
                </CustomStyle> */}
                {/* <TopSeller>
                  <i className="fas fa-gem" />
                  Nhà cung cấp hàng đầu
                </TopSeller> */}
              </CustomStyle>
            </WrapperItemLeft>
          </Col>
          <Col lg={9} xxl={8}>
            <WrapperItemRight>
              <CustomStyle>
                <CustomStyle mb={{ xs: 's5' }}>
                  <div className="content">
                    <img src={iconOdii} alt="" /> Sản phẩm từ Odii:{' '}
                    <span className="value">
                      {number_of_product - number_of_product_platform}
                    </span>
                  </div>
                </CustomStyle>
                <CustomStyle mb={{ xs: 's5' }}>
                  <div className="content">
                    <img src={shopee} alt="" /> Sản phẩm trên sàn:{' '}
                    <span className="value">{number_of_product_platform}</span>
                  </div>
                </CustomStyle>
                <CustomStyle mb={{ xs: 's5' }}>
                  <div className="content">
                    <i className="fas fa-box" /> Tổng cộng:{' '}
                    <span className="value">{number_of_product}</span>
                  </div>
                </CustomStyle>
              </CustomStyle>
              <CustomStyle>
                <CustomStyle mb={{ xs: 's5' }}>
                  <div className="content">
                    <i className="far fa-box" /> Đơn hàng:{' '}
                    <span className="value">{number_of_order}</span>
                  </div>
                </CustomStyle>
                <CustomStyle mb={{ xs: 's5' }}>
                  <CustomStyle className="content d-flex">
                    <i
                      className="far fa-star"
                      style={{ paddingRight: '4px' }}
                    />{' '}
                    Đánh giá:{' '}
                    <CustomStyle className="value orange">
                      <i className="fas fa-star" />
                      {rating || 0}
                    </CustomStyle>
                    &ensp;{number_of_rating && `(${number_of_rating}, lượt)`}
                  </CustomStyle>
                </CustomStyle>
                <CustomStyle>
                  <div className="content">
                    <i className="far fa-heart" /> Theo dõi:{' '}
                    <span className="value">{follow || 0}</span>
                  </div>
                </CustomStyle>
              </CustomStyle>
            </WrapperItemRight>
          </Col>
          <Col lg={8} xxl={10}>
            <AddressBox>
              <CustomStyle>
                <CustomStyle mb={{ xs: 's5' }}>
                  <Tooltip title={full_address}>
                    <div
                      className="content"
                      style={{ display: 'flex', alignItems: 'center' }}
                    >
                      <img src={warehouse} alt="" />
                      <div className="title">Kho nhận:</div>
                      <span className="detail">{full_address}</span>
                    </div>
                  </Tooltip>
                </CustomStyle>
                <CustomStyle mb={{ xs: 's5' }}>
                  <Tooltip title={full_address_return}>
                    <div
                      className="content"
                      style={{ display: 'flex', alignItems: 'center' }}
                    >
                      <img src={product} alt="" />
                      <div className="title">Kho trả:</div>
                      <span className="detail">{full_address_return}</span>
                    </div>
                  </Tooltip>
                </CustomStyle>
              </CustomStyle>
              <div>
                <Button
                  color="blue"
                  className="btn-save btn-sm br-6"
                  width={90}
                  onClick={onSyncAddress}
                >
                  Đồng bộ
                </Button>
              </div>
            </AddressBox>
          </Col>
        </Row>
        <CustomTabs onChange={handleChangeTab} activeKey={tab} animated={true}>
          <TabPane
            tab={
              <Tooltip title="Chỉ gồm sản phẩm được đẩy lên từ Odii">
                Sản phẩm từ Odii
              </Tooltip>
            }
            key="0"
          ></TabPane>
          <TabPane
            tab={
              <Tooltip title="Gồm các sản phẩm được thêm trực tiếp từ kênh bán">
                Sản phẩm trên sàn
              </Tooltip>
            }
            key="1"
          ></TabPane>
        </CustomTabs>
      </BodyWrapper>
    </Wrapper>
  );
});

const CustomTabs = styled(Tabs)`
  margin-top: 8px;
  .ant-tabs-nav::before {
    border: none;
  }
  .ant-tabs-ink-bar {
    background: ${({ theme }) => theme.primary};
    height: 4px !important;
    border-radius: 4px 4px 0 0;
  }
  .ant-tabs-tab {
    /* color: ${({ theme }) => Color(theme.primary).alpha(0.5)}; */
    color: ${({ theme }) => theme.grayBlue};
    font-weight: 500;
    font-size: 16px;
    &.ant-tabs-tab-active {
      .ant-tabs-tab-btn {
        opacity: 1;
        color: ${({ theme }) => theme.primary};
      }
    }
  }
`;

const WrapperItemLeft = styled.div`
  background: ${({ theme }) => theme.primary};
  box-shadow: 0px 3px 8px rgba(33, 63, 112, 0.05);
  border: 1px solid #ebebf0;
  border-radius: 3px;
  padding: 22px 25px;
  font-size: 12px;
  display: flex;

  .title {
    color: ${({ theme }) => theme.gray3};
    margin-bottom: 6px;
  }
  .value {
    font-weight: 700;
    font-size: 16px;
    .fas {
      padding-right: 5px;
    }
  }
`;
const WrapperItemRight = styled.div`
  @media screen and (min-width: 1400px) {
    padding-left: 40px;
  }
  padding-left: 10px;
  display: flex;
  > * {
    flex: 1;
  }
  > :not(:last-child) {
    /* margin-right: 34px; */
    /* border-right: 1px solid ${({ theme }) => theme.stroke}; */
  }

  .content {
    color: ${({ theme }) => theme.gray2};
  }
  .value {
    color: ${({ theme }) => theme.primary};
    .fas {
      padding-left: 5px;
      padding-right: 5px;
    }
    &.orange {
      color: ${({ theme }) => theme.orange};
    }
  }
`;

const Wrapper = styled.div`
  padding: 55px 24px;
  height: 240px;
  background: ${({ theme }) => theme.whitePrimary};
`;

export const BodyWrapper = styled.div`
  width: ${({ theme }) => `calc(999px + ${theme.space.s4 * 4}px)`};
  margin: 0 auto;
  padding: 0 24px;

  @media screen and (min-width: 1600px) {
    width: ${({ theme }) => `calc(1257px + ${theme.space.s4 * 4}px)`};
  }
`;

const CustomImage = styled(Image)`
  border: 5px solid rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  width: 60px;
  height: 60px;
`;

// const TopSeller = styled.div`
//   font-size: 12px;
//   border: 1px solid rgba(255, 255, 255, 0.13);
//   margin-bottom: 14px;
//   width: 200px;
//   border-radius: 4px;
//   background: ${({ theme }) => theme.redPrimary};
//   color: ${({ theme }) => theme.whitePrimary};
//   padding: 6px 11px;
//   font-weight: 500;
//   > .fas {
//     padding-right: 5px;
//   }
// `;
const AddressBox = styled.div`
  box-shadow: 0px 3px 8px rgb(0 0 0 / 20%);
  border: 1px solid #ebebf0;
  border-radius: 0px 4px 4px 0px;
  padding: 10px;

  img {
    margin-right: 5px;
    width: 18px;
    height: 18px;
  }

  .title {
    font-size: 14px;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-right: 5px;
    font-weight: 500;
  }

  .detail {
    font-size: 14px;
    text-overflow: ellipsis;
    overflow: hidden;
    width: 100%;
    display: block;
    white-space: nowrap;
  }
`;
