import React, { memo } from 'react';
import { CustomStyle } from 'styles/commons';
import styled from 'styled-components';
import moment from 'moment';
import { Image, Tabs } from 'app/components';
import { Col, Row, Dropdown, Menu } from 'antd';
import Color from 'color';
import { defaultImage } from 'assets/images';
const { TabPane } = Tabs;

export default memo(function SupplierInfo({
  detailRate = {},
  detail = {},
  handleChangeTab,
  tab,
}) {
  const { logo, name, created_at, supplier_warehousing_data, address } = detail;
  const { countProduct, feedback, number_reviews, rating } = detailRate;
  const menu = (
    <Menu>
      {supplier_warehousing_data?.map(e => (
        <Menu.Item>
          <SupplierMenu>
            <div className="title-supplier">{e.name}</div>
            <div className="address-supplier">
              {e.description ? e.description : 'chưa có'}
            </div>
          </SupplierMenu>
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <Wrapper>
      <BodyWrapper>
        <Row gutter={10}>
          <Col span={12}>
            <CustomStyle display="flex">
              <CustomImage
                size="120x120"
                src={logo?.location || defaultImage}
              />
              <CustomStyle color="whitePrimary" ml={{ xs: 's7' }}>
                <CustomStyle
                  fontWeight="medium"
                  fontSize={{ xs: 'f5' }}
                  mb={{ xs: 's3' }}
                >
                  {name}
                </CustomStyle>
                <TopSupplier>
                  <i className="fas fa-gem" />
                  Nhà cung cấp hàng đầu
                </TopSupplier>
                <CustomStyle mb={{ xs: 's3' }} display="flex">
                  <CustomStyle opacity={0.5} mr={{ xs: 's5' }}>
                    Tham gia:
                  </CustomStyle>
                  {!!created_at && moment(created_at).format('DD-MM-yyyy')}
                </CustomStyle>
                <CustomStyle display="flex align-items-center">
                  <CustomStyle opacity={0.5} mr={{ xs: 's5' }}>
                    Kho hàng:
                  </CustomStyle>
                  <Dropdown overlay={menu} trigger={['click']}>
                    <div>
                      {supplier_warehousing_data?.length ?? 0} Kho hàng
                      <i
                        style={{ marginLeft: 5 }}
                        className="fas fa-chevron-down"
                      ></i>
                    </div>
                  </Dropdown>
                </CustomStyle>
              </CustomStyle>
            </CustomStyle>
          </Col>
          <Col span={12}>
            <WrapperItem>
              <CustomStyle>
                <CustomStyle mb={{ xs: 's6' }}>
                  <div className="title">Tổng sản phẩm</div>
                  <div className="value">{countProduct}</div>
                </CustomStyle>
                <CustomStyle>
                  <div className="title">Điểm đánh giá</div>
                  <CustomStyle className="value" color="orange">
                    <i className="fas fa-star" />
                    {rating || 0}
                  </CustomStyle>
                </CustomStyle>
              </CustomStyle>
              <CustomStyle>
                <CustomStyle mb={{ xs: 's6' }}>
                  <div className="title">Đơn hàng trung bình</div>
                  <div className="value d-flex align-items-end">
                    0{' '}
                    <CustomStyle
                      ml={{ xs: 's3' }}
                      fontSize={{ xs: 'f1' }}
                      color="gray3"
                      fontWeight="normal"
                    >
                      Đơn / Ngày
                    </CustomStyle>
                  </div>
                </CustomStyle>
                <CustomStyle>
                  <div className="title">Số lượt đánh giá</div>
                  <CustomStyle className="value">
                    {number_reviews || 0}
                  </CustomStyle>
                </CustomStyle>
              </CustomStyle>
            </WrapperItem>
          </Col>
        </Row>
        <CustomTabs onChange={handleChangeTab} activeKey={tab} animated={true}>
          <TabPane tab="Sản phẩm" key="0"></TabPane>
          <TabPane tab="Thống kê shop" key="1"></TabPane>
        </CustomTabs>
      </BodyWrapper>
    </Wrapper>
  );
});

const CustomTabs = styled(Tabs)`
  margin-top: 8px;
  .ant-tabs-ink-bar {
    background: ${({ theme }) => theme.whitePrimary};
    height: 4px !important;
    border-radius: 4px 4px 0 0;
  }
  .ant-tabs-tab {
    color: ${({ theme }) => Color(theme.whitePrimary).alpha(0.5)};
    &.ant-tabs-tab-active {
      .ant-tabs-tab-btn {
        opacity: 1;
        color: ${({ theme }) => theme.whitePrimary};
      }
    }
  }
`;

const WrapperItem = styled.div`
  background: #ffffff;
  box-shadow: 0px 3px 8px rgba(33, 63, 112, 0.05);
  border: 1px solid #ebebf0;
  border-radius: 3px;
  padding: 22px 25px;
  font-size: 12px;
  display: flex;
  > * {
    flex: 1;
  }
  > :not(:last-child) {
    margin-right: 34px;
    border-right: 1px solid ${({ theme }) => theme.stroke};
  }

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

const Wrapper = styled.div`
  padding: 55px 24px;
  height: 271px;
  background: linear-gradient(93.55deg, #5387d6 0.89%, #3d56a6 104.58%);
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
  width: 130px;
  height: 130px;
`;

const TopSupplier = styled.div`
  font-size: 12px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.13);
  margin-bottom: 14px;
  width: 200px;
  border-radius: 900px;
  color: #ffcd73;
  padding: 6px 11px;
  font-weight: 500;
  > .fas {
    padding-right: 5px;
  }
`;

const SupplierMenu = styled.div`
  padding: 5px 45px 5px 4px;

  .title-supplier {
    font-weight: 500;
    font-size: 14px;
    line-height: 16px;
    color: #333333;
  }
  .address-supplier {
    font-weight: 400;
    font-size: 12px;
    letter-spacing: 0.05em;
    color: #828282;
  }
`;
