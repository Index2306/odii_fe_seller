import React, { memo } from 'react';
import { CustomStyle } from 'styles/commons';
import { Row, Col, Spin } from 'antd';
import request from 'utils/request';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { formatCash } from 'utils/helpers';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Line,
} from 'recharts';
import { FilterBar, ToolText } from '../Component';
// import { selectListStores } from '../slice/selectors';
import { CustomSectionWrapper, ChartWrapper } from '../styles';
import { tooltip } from 'assets/images/dashboards';

const formatterToolTip = (value, name) => [formatCash(value), name];

export default memo(function BarChartAnalysis() {
  const [data, setData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const getData = params => {
    setIsLoading(true);
    request(`oms/seller/order-stats-by-days`, { params })
      .then(result => {
        setIsLoading(false);
        const formatData = result?.data.map(v => ({
          ...v,
          local_date: moment(v.local_date).format('MMM DD'),
          'Chi phí NCC': v.total_items_price,
          'Giá bán': v.total_retail_price,
          'Lợi nhuận': v.total_profit_amount,
        }));
        setData(formatData ?? []);
      })
      .catch(err => {
        setIsLoading(false);
      });
  };

  return (
    <CustomSectionWrapper>
      <CustomStyle
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={{ xs: 's8' }}
      >
        <CustomStyle className="title">
          Doanh thu theo kỳ
          <ToolText title="Thống kê doanh thu bán hàng theo các giai đoạn">
            <img className="tooltip" src={tooltip} alt="" />
          </ToolText>
        </CustomStyle>
        <CustomStyle>
          <FilterBar isLoading={isLoading} getData={getData} />
        </CustomStyle>
      </CustomStyle>
      <Spin tip="Đang tải..." spinning={isLoading}>
        <Row>
          <ChartWrapper>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={data}
                margin={{
                  top: 20,
                  right: 20,
                  bottom: 20,
                  left: 20,
                }}
                width={400}
                height={300}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="local_date"
                  // label={{
                  //   value: 'Cửa',
                  //   position: 'bottom',
                  //   offset: 0,
                  // }}
                />
                <YAxis
                  tickFormatter={tick => {
                    return formatCash(tick);
                  }}
                  label={{
                    value: '',
                    angle: -90,
                    position: 'insideLeft',
                  }}
                />
                <Tooltip
                  // itemStyle={{ fontSize: 12 }}
                  // labelStyle={{ fontSize: 12 }}
                  formatter={formatterToolTip}
                />
                <Legend wrapperStyle={{ bottom: 0 }} />
                <Bar
                  dataKey="Chi phí NCC"
                  fill="#3D56A6"
                  // position="inside"
                  barSize={20}
                  // label={{ position: 'insideTop' }}
                >
                  {/* <LabelList
                    dataKey="total_items_price"
                    position="inside"
                    content={RenderCustomizedLabel}
                  /> */}
                </Bar>
                <Bar
                  dataKey="Giá bán"
                  fill="#27AE60"
                  barSize={20}
                  // position="inside"
                  // label={{ position: 'insideTop' }}
                />
                <Line type="monotone" dataKey="Lợi nhuận" stroke="#F2994A" />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartWrapper>
        </Row>
      </Spin>
    </CustomSectionWrapper>
  );
});
