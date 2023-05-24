import React from 'react';
import { Skeleton } from 'antd';
import { ProductList as List, ProductItem as Item } from '../styles/Main';
import { useSelector } from 'react-redux';
import { CustomStyle } from 'styles/commons';
import { selectProductList } from '../slice/selectors';
import ProductItem from './ProductItem';

export default function ProductList({ showSkeleton }) {
  const productList = useSelector(selectProductList);
  return (
    <List>
      {showSkeleton
        ? [1, 2, 3, 4, 5].map(item => (
            <Item key={item}>
              <CustomStyle
                px={{ sx: 's4' }}
                className="d-flex flex-column justify-content-center align-items-center"
              >
                <CustomStyle py={{ sx: 's4' }}>
                  <Skeleton.Image size="large" active shape="circle" />
                </CustomStyle>
                <Skeleton
                  active
                  size="large"
                  title={false}
                  paragraph={{ rows: 3 }}
                />
              </CustomStyle>
            </Item>
          ))
        : productList.map(product => (
            <ProductItem product={product} key={product.id} />
          ))}
    </List>
  );
}
