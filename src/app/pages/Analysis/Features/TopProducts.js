import React, { memo } from 'react';
import { CustomStyle } from 'styles/commons';
import { Row, Col, Spin, Tooltip } from 'antd';
import request from 'utils/request';
// import { useSelector, useDispatch } from 'react-redux';
import { List } from 'antd';
import moment from 'moment';
import { Link, useHistory } from 'react-router-dom';
import { Button, Image } from 'app/components';
import { formatCash } from 'utils/helpers';
import { v4 } from 'uuid';
import { PieChart, Pie, Sector, Cell } from 'recharts';
import { FilterBar } from '../Component';
// import { selectListStores } from '../slice/selectors';
import { CustomSectionWrapper, ListProduct } from '../styles';
import { tooltip } from 'assets/images/dashboards';
// import { isEmpty, chunk } from 'lodash';

export const COLORS = [
  '#A08FF5',
  '#F4C356',
  '#6CEB79',
  '#EC7C7C',
  '#6C798F',
  '#fab1b3',
  '#6c8490',
  '#95dafd',
  '#cef77e',
  '#f67305',
  '#5f385f',
  '#495d28',
  '#fae477',
  '#a8c671',
  '#d96681',
  '#5260af',
  '#f07bdc',
  '#cbc0fa',
  '#944059',
];

const renderActiveShape = props => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;
  const { percentage } = payload;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';
  // const size = 2;
  // const splitText = payload?.name?.split(' ').reduce((final, text, i) => {
  //   if (!(i % size)) {
  //     final.push(payload?.name?.split(' ').slice(i, i + size));
  //   }
  //   return final;
  // }, []);

  // const splitText = chunk(payload.name.split(' '), 2);

  // const splitText = [];
  // const temporary = payload.name.split(' ');
  // while (temporary.length) {
  //   splitText.push(temporary.splice(0, size));
  // }

  return (
    <g>
      <text
        x={cx}
        y={cy}
        dy={8}
        textAnchor="middle"
        fill={fill}
        fontWeight="bold"
        fontSize="22px"
      >
        {/* {payload.name} */}
        {/* {`${Number((percent * 100).toFixed(2))}%`} */}
        {`${percentage}%`}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
        fontWeight="bold"
      >
        {/* {`${Number((percent * 100).toFixed(2))}%`} */}
        {`${percentage}%`}
        {/* {`${value}`} */}
      </text>

      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        // y={ey - 5}
        dy={18}
        fontSize="12px"
        textAnchor={textAnchor}
        fill="#999"
      >
        {formatCash(Number(value.toFixed(2)))}
      </text>
      {/* {splitText.map((item, i) => (
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey + 7 + i * 12}
          // y={ey}
          textAnchor={textAnchor}
          fill="#333"
        >
          {`${item.join(' ')}`}
        </text>
      ))} */}
    </g>
  );
};

export default memo(function TopProducts() {
  const [data, setData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [active, setActive] = React.useState({
    index: 0,
    value: data?.[0],
  });
  const history = useHistory();

  const getData = params => {
    setIsLoading(true);
    request(`oms/seller/top-order-stats-of-product`, { params })
      .then(result => {
        setIsLoading(false);
        const formatData = result?.data?.by_product.map(v => ({
          ...v,
          local_date: moment(v.local_date).format('MMM DD'),
          ...v.product,
        }));
        setData(formatData ?? []);
        setActive({ ...active, data: formatData?.[0] });
      })
      .catch(err => {
        setIsLoading(false);
      });
  };

  const onPieEnter = (value, index) => {
    setActive({ index, data: value });
  };

  const goDetailList = () => {
    history.push('/orders');
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
          Top sản phẩm
          <Tooltip
            placement="right"
            title="Những sản phẩm có doanh thu cao nhất"
          >
            <img className="tooltip" src={tooltip} alt="" />
          </Tooltip>
        </CustomStyle>
        <CustomStyle>
          <FilterBar isLoading={isLoading} getData={getData} />
        </CustomStyle>
      </CustomStyle>
      <Spin tip="Đang tải..." spinning={isLoading}>
        <Row>
          <Col span={10}>
            <CustomStyle borderRight="1px solid" borderColor="stroke">
              <PieChart width={400} height={280} className="mx-auto w-100">
                <Pie
                  activeIndex={active.index}
                  activeShape={renderActiveShape}
                  data={data || []}
                  cx={190}
                  cy={140}
                  // innerRadius={40}
                  // outerRadius={90}
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="retail_price"
                  onMouseEnter={onPieEnter}
                >
                  {data?.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
              <CustomStyle textAlign="center" mb={{ xs: 's5' }}>
                5 sản phẩm có doanh thu cao nhất
              </CustomStyle>
              <CustomStyle
                mb={{ xs: 's7' }}
                textAlign="center"
                display="flex"
                justifyContent="center"
              >
                <Button width="125px" className="btn-sm" onClick={goDetailList}>
                  Xem chi tiết
                </Button>
              </CustomStyle>
            </CustomStyle>
          </Col>
          <Col span={14}>
            <ListProduct>
              {data?.map((record, index) => (
                <CustomStyle display="flex" key={v4()}>
                  <CustomStyle
                    display="flex"
                    alignItems="center"
                    px={{ xs: 's4' }}
                  >
                    {index + 1}
                  </CustomStyle>
                  <CustomStyle flex={1}>
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          record?.thumb?.location ? (
                            <Image
                              size="200x200"
                              src={record?.thumb?.location}
                            />
                          ) : (
                            <div className="add-image">
                              {/* <PlusOutlined /> */}
                            </div>
                          )
                        }
                        title={
                          <Link to={`selling-products/update/${record.id}`}>
                            {record.name}
                          </Link>
                        }
                        description={record.sku || record.barcode}
                      />
                    </List.Item>
                  </CustomStyle>
                  <CustomStyle
                    display="flex"
                    alignItems="center"
                    fontWeight="bold"
                    px={{ xs: 's4' }}
                    color={COLORS[index]}
                  >
                    {record.percentage}%
                  </CustomStyle>
                </CustomStyle>
              ))}
            </ListProduct>
          </Col>
        </Row>
      </Spin>
    </CustomSectionWrapper>
  );
});
