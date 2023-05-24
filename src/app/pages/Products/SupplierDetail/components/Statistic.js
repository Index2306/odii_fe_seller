import React, { memo } from 'react';
import { CustomStyle } from 'styles/commons';
import styled from 'styled-components';
import moment from 'moment';
import { Image, Tabs } from 'app/components';
import { Col, Row } from 'antd';
import {
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
  linearGradient,
} from 'recharts';

export default memo(function Statistic({
  dataStatistic = {},
  detailRate = {},
}) {
  const { countProduct, number_reviews, rating } = detailRate;
  const { new_order, new_product, new_views } = dataStatistic;

  const data = [
    {
      name: 'Mon',
      selled: 0,
    },
    {
      name: 'Tue',
      selled: 0,
    },
    {
      name: 'Wed',
      selled: 0,
    },
    {
      name: 'Thu',
      selled: 0,
    },
    {
      name: 'Fri',
      selled: 0,
    },
    {
      name: 'Sat',
      selled: 0,
    },
    {
      name: 'Sun',
      selled: 0,
    },
  ];

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
      <AreaDiv>
        <CustomStyle
          fontSize={{ xs: 'f4' }}
          fontWeight="medium"
          mb={{ xs: 's5' }}
        >
          Thống kê chi tiết
        </CustomStyle>
        <div className="chart-area-wrapper">
          <div className="chart-area-header">
            <CustomStyle
              fontSize={{ xs: 'f3' }}
              fontWeight="medium"
              mb={{ xs: 's5' }}
            >
              Sản phẩm đã bán
            </CustomStyle>
          </div>
          <div className="chart-area">
            <AreaChart
              width={945}
              height={255}
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6BADF5" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#6BADF5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="selled"
                stroke="#6BADF5"
                fillOpacity={1}
                fill="url(#colorUv)"
              />
            </AreaChart>
          </div>
        </div>
      </AreaDiv>
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

const AreaDiv = styled.div`
  padding-top: 30px;

  .chart-area-wrapper {
    padding: 25px;
    background: #ffffff;
    border: 1px solid #ebebf0;
    box-shadow: 0px 3px 8px rgba(33, 63, 112, 0.05);
    border-radius: 3px;

    .chart-area-header {
      margin-bottom: 42px;
    }

    .chart-area {
      display: flex;
      justify-content: center;

      .recharts-cartesian-axis-tick-line {
        display: none;
      }
    }
  }
`;
