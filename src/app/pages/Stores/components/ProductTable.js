import React, { useState } from 'react';
import { Table } from 'antd';
import { ProductList as List, ProductItem as Item } from '../styles';
import { useSelector } from 'react-redux';
import { CustomStyle } from 'styles/commons';
import { selectProductList } from '../slice/selectors';
import { ConsoleSqlOutlined } from '@ant-design/icons';
import DefaultIMG from 'assets/images/product-thumb-default.svg';
import styled from 'styled-components';
import { formatMoney } from 'utils/helpers';
import constants from 'assets/constants';
import { BoxColor } from 'app/components';
export default function ProductTable() {
  const productList = useSelector(selectProductList);
  const [selectedCustomers, setSelectedCustomers] = useState();
  const onRowSelection = (selectedRowKeys, selectedRow) => {
    const selectedCustomerIds = selectedRow.map(record => record);
    setSelectedCustomers(selectedCustomerIds);
  };

  return (
    <TableCustom>
      <Table
        className="media-table-body"
        pagination={false}
        rowSelection={{ onChange: onRowSelection }}
        rowKey={record => record.id}
        dataSource={productList}
      >
        <Table.Column
          className="bg-white"
          title="Sản phẩm"
          width="35%"
          render={(value, el) => (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div className="product-image">
                <img src={el.thumb_url || DefaultIMG} alt={el.name} />
              </div>
              <div className="product-name">{el.name}</div>
            </div>
          )}
        ></Table.Column>
        <Table.Column
          className="bg-white"
          title="Ngành hàng"
          width="17%"
          render={(value, el) => (
            <div className="text produce-info">{el.product_category.name}</div>
          )}
        ></Table.Column>
        <Table.Column
          className="bg-white custom"
          title="Biến thể"
          width="10%"
          render={(value, el) => (
            <div className="text variant-info">{el.number_of_variation}</div>
          )}
        ></Table.Column>
        <Table.Column
          className="bg-white custom"
          title="Tồn kho"
          width="10%"
          render={(value, el) => (
            <div className="text quantity-info">{el.total_quantity}</div>
          )}
        ></Table.Column>
        <Table.Column
          className="bg-white custom"
          title="Giá bán"
          width="10%"
          render={(value, el) => (
            <div className="price-info">{formatMoney(el.price)}</div>
          )}
        ></Table.Column>
        <Table.Column
          className="bg-white custom-center"
          title="Trạng thái"
          width="13%"
          render={(value, el) => {
            const currentStatus = constants.COMMON_STATUS.find(
              v => v.id === `${el.status}`,
            );
            return (
              <BoxColor colorValue={currentStatus?.color}>
                {currentStatus?.name}
              </BoxColor>
            );
          }}
        ></Table.Column>
      </Table>
    </TableCustom>
  );
}

const TableCustom = styled.div`
  .media-table-body {
    cursor: pointer;
  }
  .text {
    font-weight: 400;
    font-size: 12px;
    line-height: 18px;
    color: #333333;
  }
  .custom {
    text-align: right;
  }
  .custom-center {
    text-align: center;
  }
  .product-image {
    border: 1px solid #e2e7f8;
    border-radius: 4px;

    img {
      width: 40px;
      height: 40px;
      object-fit: cover;
    }
  }
  .product-name {
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
    color: #333333;
    margin-left: 10px;
  }
  .price-info {
    font-size: 14px;
    color: #f2994a;
    line-height: 18px;
    font-weight: 400;
  }
  .status-info {
    border-radius: 190px;
    width: 90px;
    height: 26px;
    margin: auto;
    text-align: center;

    span {
      font-size: 14px;
      line-height: 18px;
      font-weight: 400;
    }
  }
  .bg-white {
    background: #fff;
  }
  .ant-table-selection-column {
    background: #fff;
  }
`;
