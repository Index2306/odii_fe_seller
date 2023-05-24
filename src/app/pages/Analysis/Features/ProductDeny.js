import React from 'react';
import styled from 'styled-components/macro';
import { CustomStyle } from 'styles/commons';
import { Row, Col, Table, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import request from 'utils/request';

import { Input } from 'app/components';
import { defaultImage } from 'assets/images';
import moment from 'moment';
import constants from 'assets/constants';
import { useSellingProductsSlice } from 'app/pages/ProductsList/SellingProducts/slice';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

const initState = {
  keyword: '',
};

export default function ProductDeny() {
  const [data, setData] = React.useState([]);
  const [filter, setFilter] = React.useState(initState);
  const [loading, setLoading] = React.useState(false);
  const { actions } = useSellingProductsSlice();
  const dispatch = useDispatch();
  const history = useHistory();

  React.useEffect(() => {
    if (filter.keyword.length >= 2) {
      getData({ ...filter, page_size: 6 });
    } else {
      getData({ page_size: 6 });
    }
  }, [filter]);

  const handleFilter = type => e => {
    const value = (e?.target?.value ?? e) || '';
    let values = {};
    values = { ...filter, [type]: value };
    setFilter(values);
  };

  const getData = params => {
    setLoading(true);
    request(`/oms/seller/report-deny-product-by-days`, { params }).then(
      result => {
        if (result) {
          setData(result);
          setLoading(false);
        }
      },
    );
  };

  const onChangePage = page => {
    getData({ page: page, page_size: 6 });
  };

  const handleClickName = id => () => {
    dispatch(actions.setListSelling([id]));
    history.push(`/selling-products/update/${id}`);
  };

  const columns = [
    {
      title: <div className="title-box text-center">STT</div>,
      dataIndex: 'id',
      key: 'id',
      width: '6%',
      render: (text, record, index) => (
        <div className="text-center">
          {index + 1 + (data.pagination.page - 1) * data.pagination.page_size}
        </div>
      ),
    },
    {
      title: <div className="title-box ">Sản phẩm</div>,
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div
          className="d-flex alignCenter title-event"
          onClick={handleClickName(record.id)}
        >
          <div className="report-image">
            <img src={record?.thumb?.origin || defaultImage} alt="" />
          </div>
          <div className="">
            <div className="inline-block name-prod">{text}</div>
            <div className="inventory">
              <img
                src={
                  constants.PLATFORM_CHANNEL?.find(
                    item => item.id.toLowerCase() === record.platform,
                  )?.icon
                }
                alt=""
              />
              {record.name_store}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: <div className="title-box text-right">Ngày từ chối</div>,
      dataIndex: 'updated_at',
      key: 'updated_at',
      width: '12%',
      render: text => (
        <div className="text-right">{moment(text).format('DD/MM/YYYY')}</div>
      ),
    },
    {
      title: <div className="title-box text-right">Lý do</div>,
      dataIndex: 'platform_reject_reason',
      key: 'platform_reject_reason',
      width: '22%',
      render: (text, record) => <div className="text-right">{text}</div>,
    },
  ];

  return (
    <CustomStyle className="tablesell">
      <CustomStyle
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        className="header"
      >
        <CustomStyle className="title">Sản phẩm không hoạt động</CustomStyle>
        <CustomStyle className="see-more" width="250px">
          <Input
            placeholder="Tìm kiếm sản phẩm, cửa hàng"
            allowClear
            size="medium"
            // color="#7C8DB5"
            color="primary"
            prefix={<SearchOutlined />}
            onChange={handleFilter('keyword')}
          />
        </CustomStyle>
      </CustomStyle>
      <CustomStyle>
        <Spin tip="Đang tải..." spinning={loading}>
          <Row gutter={24}>
            <Col span={24}>
              <TableWrapper>
                <Table
                  columns={columns}
                  dataSource={data.data_deny}
                  rowSelection={false}
                  pagination={{
                    showSizeChanger: false,
                    hideOnSinglePage: false,
                    current: data?.pagination?.page,
                    total: data?.pagination?.total,
                    defaultPageSize: data?.pagination?.page_size,
                    onChange: e => onChangePage(e),
                    showTotal: (total, range) =>
                      `${range[0]}-${range[1]} trên tổng ${total} bản ghi`,
                  }}
                ></Table>
              </TableWrapper>
            </Col>
          </Row>
        </Spin>
      </CustomStyle>
    </CustomStyle>
  );
}

const TableWrapper = styled.div`
  table {
    border: 1px solid #ebebf0;
  }
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
    font-weight: 500;
    font-size: 14px;
    line-height: 16px;
    color: #6c798f;
    border-radius: 4px 4px 0px 0px;
  }
  .title-event {
    cursor: pointer;
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
    font-weight: 400;
    font-size: 12px;
    line-height: 18px;
    color: #828282;

    img {
      width: 12px;
      margin-right: 6px;
    }
  }
  .report-image {
    margin-right: 14px;

    img {
      width: 56px;
      height: 56px;
      object-fit: cover;
    }
  }
`;
