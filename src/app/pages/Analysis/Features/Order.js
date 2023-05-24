import React, { memo } from 'react';
import { CustomSectionWrapper, WrapOrder } from '../styles';
import { CustomStyle } from 'styles/commons';
import { Row, Col, Spin, Tooltip } from 'antd';
import request from 'utils/request';
import { useSelector, useDispatch } from 'react-redux';
import {
  newOrder,
  processOrder,
  doneOrder,
  failOrder,
  tooltip,
} from 'assets/images/dashboards';
import { v4 } from 'uuid';
import { FilterBar } from '../Component';
// import { selectListStores } from '../slice/selectors';

const dataOrder = [
  {
    icon: newOrder,
    title: 'Đơn mới',
    total: 'order_new',
    percent: '+7%',
    hint: 'số lượng đơn hàng mới',
  },
  {
    icon: processOrder,
    title: 'Đang tiến hành',
    total: 'order_pending',
    percent: '+7%',
    hint: 'số lượng đơn hàng đang được xử lý',
  },
  {
    icon: doneOrder,
    title: 'Đã hoàn tất',
    total: 'order_success',
    percent: '+9%',
    hint: 'số lượng đơn hàng đã hoàn thành',
  },
  {
    icon: failOrder,
    title: 'Đã hủy',
    total: 'order_cancelled',
    percent: '-3%',
    colorBox: '#EB5757',
    hint: 'số lượng đơn hàng đã bị bủy',
  },
];

export default memo(function Order() {
  const [order, setOrder] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(true);

  const getData = params => {
    setIsLoading(true);
    request(`oms/seller/order-stats-by-time`, { params })
      .then(result => {
        setIsLoading(false);
        setOrder(result?.data ?? {});
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
          Đơn hàng
          <Tooltip
            placement="right"
            title="Thống kê số lượng đơn hàng theo từng giai đoạn"
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
          {dataOrder.map(item => (
            <Col key={v4()} span={6}>
              <WrapOrder colorBox={item.colorBox}>
                <CustomStyle marginRight={{ xs: 's4' }}>
                  <img src={item.icon} alt="" />
                </CustomStyle>
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
                    <span className="number">{order?.[item.total]}</span>
                    {/* <span className="box">{item.percent}</span> */}
                  </CustomStyle>
                </CustomStyle>
              </WrapOrder>
            </Col>
          ))}
        </Row>
      </Spin>
    </CustomSectionWrapper>
  );
});
