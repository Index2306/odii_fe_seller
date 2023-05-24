import React, { memo } from 'react';
import { CustomStyle } from 'styles/commons';
import styled from 'styled-components';
import moment from 'moment';
import { Image, Tabs } from 'app/components';
import { Col, Row } from 'antd';

export default memo(function Statistic({
  dataStatistic = {},
  detailRate = {},
}) {
  const { countProduct, number_reviews, rating } = detailRate;
  const { new_order, new_product, new_views } = dataStatistic;

  return (
    <div>
      <Row gutter={34}>
        <Col span={12}>
          <CustomStyle
            fontSize={{ xs: 'f4' }}
            fontWeight="medium"
            mb={{ xs: 's5' }}
          >
            Tổng quan
          </CustomStyle>
          <WrapperRight>
            <CustomStyle>
              <CustomStyle mb={{ xs: 's6' }}>
                <div className="title">Tổng sản phẩm</div>
                <div className="value">{countProduct ?? 0}</div>
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
          </WrapperRight>
        </Col>
        <Col span={12}>
          <CustomStyle
            fontSize={{ xs: 'f4' }}
            fontWeight="medium"
            mb={{ xs: 's5' }}
          >
            Thống kê theo ngày
          </CustomStyle>
          <WrapperRight>
            <CustomStyle>
              <CustomStyle mb={{ xs: 's6' }}>
                <div className="title">New products</div>
                <div className="value">{new_product ?? 0}</div>
              </CustomStyle>
              <CustomStyle>
                <div className="title">Điểm đánh giá</div>
                <CustomStyle className="value">{new_views || 0}</CustomStyle>
              </CustomStyle>
            </CustomStyle>
            <CustomStyle>
              <CustomStyle mb={{ xs: 's6' }}>
                <div className="title">New order</div>
                <div className="value d-flex align-items-end">{new_order}</div>
              </CustomStyle>
            </CustomStyle>
          </WrapperRight>
        </Col>
      </Row>
    </div>
  );
});

const WrapperRight = styled(CustomStyle)`
  background: #ffffff;
  box-shadow: 0px 3px 8px rgba(33, 63, 112, 0.05);
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
