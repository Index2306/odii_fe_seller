import React, { memo } from 'react';
import styled from 'styled-components/macro';
import { CustomStyle } from 'styles/commons';
import { Row, Col, Table, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import request from 'utils/request';
import { formatMoney } from 'utils/helpers';
import { defaultImage } from 'assets/images';

import { Select } from 'app/components';
import { LazadaIcon, ShopeeIcon, TiktokIcon } from 'assets/images/platform';
import constants from 'assets/constants';

const { Option } = Select;

export default memo(function ProductStatus() {
  const [data, setData] = React.useState([]);
  const [search, setSearch] = React.useState();
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    getData();
  }, [search]);

  const handleFilter = type => e => {
    const value = (e?.target?.value ?? e) || '';
    let values = {};
    if (value.length >= 2) {
      values = { ...search, [type]: value };
      setSearch(values);
    } else {
      setSearch();
      getData();
    }
  };

  const mapToData = data => {
    let fetData = [];
    constants.PRODUCT_STATUS?.forEach(item => {
      const newPlatform = data.reduce(
        (u, v) => {
          let itemData = {
            total_product: u?.total_product + parseInt(v[item.status]),
            [v.platform ? v.platform : 'other']: v[item.status],
          };
          if (u) {
            Object.assign(u, itemData);
          }
          return u;
        },
        {
          name: item.name,
          icon: item.icon,
          total_product: 0,
        },
      );
      if (newPlatform) {
        fetData.push(newPlatform);
      }
    });
    setData(fetData);
  };

  const getData = params => {
    setLoading(true);
    request(`oms/seller/statistic-status-product-by-days`, { params }).then(
      result => {
        if (result) {
          mapToData(result.data);
          setLoading(false);
        }
      },
    );
  };

  const columns = [
    {
      title: <div className="title-box text-center">TẤT CẢ CÁC SÀN</div>,
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div className="d-flex alignCenter">
          <div className="report-image">
            <img src={record?.icon || defaultImage} alt="" />
          </div>
          <div className="">
            <div className="inline-block name-prod">{text}</div>
            <div className="inline-block attribute"></div>
            <div className="inventory">{record.total_product}</div>
          </div>
        </div>
      ),
    },
    {
      title: (
        <div
          className="title-box text-center text-platform"
          style={{ color: '#EA501F' }}
        >
          <img src={ShopeeIcon} alt="" />
          Shoppe
        </div>
      ),
      dataIndex: 'shopee',
      key: 'shopee',
      width: '18%',
      render: text => <div className="text-center">{text}</div>,
    },
    {
      title: (
        <div
          className="title-box text-center text-platform"
          style={{ color: '#4070f4' }}
        >
          <img src={LazadaIcon} alt="" />
          Lazada
        </div>
      ),
      dataIndex: 'lazada',
      key: 'lazada',
      width: '18%',
      render: text => <div className="text-center">{text}</div>,
    },
    {
      title: (
        <div
          className="title-box text-center text-platform"
          style={{ color: 'black' }}
        >
          <img src={TiktokIcon} alt="" />
          Tiktok
        </div>
      ),
      dataIndex: 'tiktok',
      key: 'tiktok',
      width: '18%',
      render: text => <div className="text-center">{text}</div>,
    },
    {
      title: <div className="title-box text-center">NGOẠI SÀN</div>,
      dataIndex: 'other',
      key: 'other',
      width: '18%',
      render: text => <div className="text-right">{text}</div>,
    },
  ];

  return (
    <CustomStyle className="tablesell" style={{ marginBottom: 24 }}>
      <CustomStyle
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        className="header"
      >
        <CustomStyle className="title">
          Thống kê trạng thái sản phẩm
        </CustomStyle>
        {/* <CustomStyle className="see-more" width="250px">
          <Select
            color="primary"
            size="medium"
            value="Tất cả ngành hàng"
          ></Select>
        </CustomStyle> */}
      </CustomStyle>
      <CustomStyle>
        <Spin tip="Đang tải..." spinning={loading}>
          <Row gutter={24}>
            <Col span={24}>
              <TableWrapper>
                <Table
                  columns={columns}
                  dataSource={data}
                  pagination={false}
                  rowSelection={false}
                ></Table>
              </TableWrapper>
            </Col>
          </Row>
        </Spin>
      </CustomStyle>
    </CustomStyle>
  );
});

const TableWrapper = styled.div`
  .ant-table-tbody > tr > td {
    padding: 8px 16px;
  }
  .ant-list-item {
    padding: 5px 30px;
  }
  .ant-table-tbody > tr {
    height: 50px;
  }
  .ant-table-cell {
    &:before {
      display: none;
    }
  }
  .ant-table-thead > tr .ant-table-cell {
    padding: 10px 16px;
    font-weight: 400;
    font-size: 14px;
    line-height: 16px;
    color: #6c798f;
    border-radius: 4px 4px 0px 0px;
    background: #fff;
  }

  .text-right {
    text-align: right;
  }
  .alignCenter {
    align-items: center;
  }
  .inline-block {
    display: inline-block;
  }
  .attribute {
    margin-left: 8px;
  }
  .name-prod {
    font-weight: 500;
    font-size: 14px;
    line-height: 18px;
    color: #181918;
  }
  .inventory {
    font-weight: 600;
    font-size: 20px;
    line-height: 24px;
    color: #333333;
  }
  .report-image {
    width: 56px;
    height: 56px;
    margin-right: 14px;

    img {
      width: 100%;
    }
  }
  .text-platform {
    font-weight: 500;
    img {
      width: 27px;
      height: 27px;
      margin-right: 5px;
    }
  }
`;
