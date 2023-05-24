import * as React from 'react';
import styled from 'styled-components';
import { defaultImage } from 'assets/images';
import { useSelector, useDispatch } from 'react-redux';
import { SectionWrapper, CustomTitle, CustomStyle } from 'styles/commons';
import { Table, Spin, Row, Col, List, Tooltip, Collapse } from 'antd';
import { Image, BoxColor, Button } from 'app/components';
import { selectLoading } from '../slice/selectors';
import { formatMoney } from 'utils/helpers';
import constants from 'assets/constants';

const { Panel } = Collapse;

export default function TableVarient(props) {
  const { data } = props;
  const isLoading = useSelector(selectLoading);

  const columns = React.useMemo(
    () => [
      {
        title: <div className="custome-header"></div>,
        // width: 170,
      },
      {
        title: <div className="custome-header"></div>,
        width: '7%',
        render: (text, record) => {
          const option = [record.option_1, record.option_2, record.option3];
          return (
            <CustomStyle textAlign="center" className="title-box">
              {option.filter(item => item).join(' - ')}
            </CustomStyle>
          );
        },
      },
      {
        title: (
          <div className="custome-header">
            <CustomStyle textAlign="right" className="title-box">
              Tồn kho
            </CustomStyle>
          </div>
        ),
        dataIndex: 'total_quantity',
        key: 'total_quantity',
        width: '7%',
        render: (text, record) => (
          <CustomStyle textAlign="right">{text}</CustomStyle>
        ),
      },
      {
        title: (
          <div className="custome-header">
            <CustomStyle className="title-box" pl={{ xs: 's4' }}>
              Nền tảng
            </CustomStyle>
          </div>
        ),
        dataIndex: 'origin_supplier_price',
        key: 'origin_supplier_price',
        width: '11%',
        render: text =>
          text && (
            <CustomStyle textAlign="right" color="orange">
              {formatMoney(text)}
            </CustomStyle>
          ),
      },
      {
        title: (
          <div className="custome-header">
            <CustomStyle textAlign="right" className="title-box">
              Giá sản phẩm
            </CustomStyle>
          </div>
        ),
        dataIndex: 'retail_price',
        key: 'retail_price',
        width: '11%',
        render: text =>
          text && (
            <CustomStyle textAlign="right" color="orange">
              {formatMoney(text)}
            </CustomStyle>
          ),
      },
      {
        title: <div className="custome-header">Lợi nhuận</div>,
        width: '11%',
        render: (text, record) => {
          const profit = record.retail_price - record.origin_supplier_price;
          return (
            <CustomStyle textAlign="right" color="green">
              {formatMoney(profit)}
            </CustomStyle>
          );
        },
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Cửa hàng</div>
          </div>
        ),
        width: '10%',
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Trạng thái</div>
          </div>
        ),
        width: '150px',
      },
    ],
    [data],
  );

  return (
    <TableVarientCustom>
      <Spin tip="Đang tải..." spinning={isLoading || data ? false : true}>
        <Row gutter={24}>
          <Col span={24}>
            <div>
              <Table
                columns={columns}
                dataSource={data}
                pagination={false}
                rowSelection={true}
              ></Table>
            </div>
          </Col>
        </Row>
      </Spin>
    </TableVarientCustom>
  );
}

const WrapperOption = styled.div`
  .ant-image {
    width: 32px;
    border-radius: 4px;
  }
  .ant-list-item-meta {
    align-items: center;
  }
  .ant-list-item-meta-title > * {
    overflow: hidden;
    /* text-align: justify; */
    display: -webkit-box;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
    line-height: 18px; /* fallback */
    max-height: 36px;
    -webkit-line-clamp: 2; /* number of lines to show */
  }
  .ant-list-item-meta-description {
    font-weight: 400;
    font-size: 12;
    color: rgba(0, 0, 0, 0.4);
  }

  .ant-list-item-meta-avatar {
    margin-right: 6px;
  }

  .ant-image-img {
    width: 35px;
  }
`;

const TableVarientCustom = styled.div`
  .ant-list-item {
    padding: 5px 30px;
  }
  .ant-table-thead {
    display: none;
  }
  .ant-table-selection-column {
    opacity: 0;
  }
  .ant-table-tbody > tr {
    height: 44px;
  }
  .ant-table-tbody > tr > td {
    padding: 0px 10px !important;
    border-bottom: 1px solid #fff !important;
  }
  .ant-table-tbody > tr.ant-table-row:hover > td {
    background: #f6f6fb !important;
  }
`;
