import React, { memo } from 'react';
import { Row, Col, Tooltip } from 'antd';
import request from 'utils/request';
// import { useSelector, useDispatch } from 'react-redux';
import {
  newOrder,
  processOrder,
  doneOrder,
  failOrder,
} from 'assets/images/dashboards';
import Color from 'color';
import styled from 'styled-components';
import { SectionWrapper, CustomStyle } from 'styles/commons';
import { tooltip } from 'assets/images/dashboards';

// import { selectListStores } from '../slice/selectors';

const dataOrder = [
  {
    icon: newOrder,
    title: 'Đơn mới',
    total: 'order_new',
    percent: '+7%',
    hint: 'đơn hàng mới nhận hôm nay',
  },
  {
    icon: processOrder,
    title: 'Đang tiến hành',
    total: 'order_pending',
    percent: '+7%',
    hint: 'đơn hàng đang được xử lý hôm nay',
  },
  {
    icon: doneOrder,
    title: 'Đã hoàn tất',
    total: 'order_success',
    percent: '+9%',
    hint: 'đơn hàng đã hoàn thành hôm nay',
  },
  {
    icon: failOrder,
    title: 'Đã hủy',
    total: 'order_cancelled',
    percent: '-3%',
    colorBox: '#EB5757',
    hint: 'đơn hàng đã bị hủy hôm nay',
  },
];

export default memo(function Order({ steps, isLoading, setIsLoading }) {
  const [order, setOrder] = React.useState({});

  React.useEffect(() => {
    setIsLoading(true);
    request(`oms/seller/statistics/new-order`, {})
      .then(result => {
        setIsLoading(false);

        setOrder(result?.data ?? {});
      })
      .catch(err => {
        setIsLoading(false);
      });
  }, []);
  return (
    <CustomSectionWrapper>
      <CustomStyle className="title">Đơn hàng hôm nay</CustomStyle>
      {/* <CustomStyle>
          <FilterBar isLoading={isLoading} getData={getData} />
        </CustomStyle> */}
      <Row>
        {dataOrder.map((item, index) => (
          <Col span={6} key={index}>
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
                  <span className="number">{order[item.total] || 0}</span>
                  {/* <span className="box">{item.percent}</span> */}
                </CustomStyle>
              </CustomStyle>
            </WrapOrder>
          </Col>
        ))}
      </Row>
    </CustomSectionWrapper>
  );
});

const CustomSectionWrapper = styled(SectionWrapper)`
  border: none;
  margin-bottom: 35px;
  .title {
    font-weight: 500;
    font-size: 18px;
    margin-bottom: 18px;
  }

  .tooltip {
    margin-left: 6px;
    margin-bottom: 6px;
    cursor: pointer;
  }
`;

const WrapOrder = styled.div`
  display: flex;

  .ant-col:not(:last-child) & {
    margin-right: 34px;
    border-right: 1px solid ${({ theme }) => theme.stroke};
  }
  .number {
    line-height: 25px;
    font-size: 22px;
    margin-right: 6px;
    font-weight: 900;
  }
  .box {
    height: 18px;
    color: ${({ colorBox }) => colorBox || '#27AE60'};
    padding: 2px 4px;
    font-size: 12px;
    border-radius: 10px;
    background-color: ${({ colorBox }) =>
      Color(colorBox || '#27AE60').alpha(0.1)};
  }
`;
