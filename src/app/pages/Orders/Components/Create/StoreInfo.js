import React, { useState, useEffect, memo } from 'react';
import { Image } from 'app/components';
import { Row, Col, Form, Select, Input } from 'antd';

import request from 'utils/request';
import { isEmpty } from 'lodash';

import { StoreInfoWrapper } from '../../styles/OrderDetail';

const { Option } = Select;

export default memo(function StoreInfo({ setStoreId, setStoreSource }) {
  const [stores, setStores] = useState([]);
  useEffect(() => {
    fetchStores();
  }, []);

  const storePlatformIcon = {
    height: '16px',
    width: '16px',
    objectFit: 'cover',
    border: '1px solid #e1e1e1',
    borderRadius: '100%',
  };
  const storePlatformName = {
    'margin-left': '6px',
  };

  const fetchStores = async () => {
    const response = await request(`product-service/seller/stores`, {
      method: 'get',
    });
    if (response.is_success) {
      setStores(response.data);
    }
  };

  const onChangeValue = value => {
    let storeIds = stores.map(e => e.id);
    if (value.length > 1) {
      if (storeIds?.includes(value[value.length - 1])) {
        setStoreId(value[value.length - 1]);
      } else {
        setStoreId(null);
        setStoreSource(value[value.length - 1]);
      }
      value.shift();
    } else {
      if (storeIds?.includes(value[0])) {
        setStoreId(value[0]);
      } else {
        setStoreId(null);
        setStoreSource(value[0]);
      }
    }
  };

  return (
    <StoreInfoWrapper className="box-df">
      <div className="store-info__top create">
        <div className="mt-4">
          <span className="section-title lh-1">Kênh bán</span>
        </div>
        <div className="store-platform-wrapper">
          <div className="store-platform">
            <Select
              mode="tags"
              allowClear
              placeholder="Lựa chọn kênh bán"
              className="store-platform-select"
              onChange={value => onChangeValue(value)}
            >
              {/* <Option key={-1} value={null} style={{ background: '#fbfbfb' }}>
                <span>Kênh bán hàng khác</span>
              </Option> */}
              {stores.map(store => (
                <Option key={store.id} value={store.id}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Image alt="" src={store?.logo} style={storePlatformIcon} />
                    <span style={storePlatformName}>{store.name}</span>
                    <span style={{ color: '#7c8db5' }}>
                      &nbsp;&nbsp;-&nbsp;&nbsp;
                    </span>
                    <span>{store.platform} </span>
                  </div>
                </Option>
              ))}
            </Select>
          </div>
        </div>
      </div>
    </StoreInfoWrapper>
  );
});
