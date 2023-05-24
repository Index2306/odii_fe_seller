import React, { memo, useRef } from 'react';
import { Row, Col, Space } from 'antd';
import { Input, Select } from 'app/components';
import { SearchOutlined } from '@ant-design/icons';
import Filter from 'app/hooks/Filter';
import { CustomStyle } from 'styles/commons';
import constants from 'assets/constants';
const { Option } = Select;

const initState = {
  keyword: '',
  status: '',
  store_id: '',
  platform: '',
};

const FilterBar = memo(function FilterBar({ isLoading, history, listStores }) {
  const [filter, setFilter] = React.useState(initState);
  const ref = useRef(null);
  const handleFilter = (type, needRefresh) => e => {
    const value = (e?.target?.value ?? e) || '';
    const values = { ...filter, [type]: value };
    if (e.type === 'click' || needRefresh) {
      if (ref.current) {
        ref.current.callBack(values);
      }
    }
    setFilter(values);
  };

  return (
    <Filter
      initState={initState}
      filter={filter}
      setFilter={setFilter}
      ref={ref}
      // component={
      //   <Row>
      //     <Col xs={24} lg={20}>
      //       <Input
      //         placeholder="Nhập từ khoá"
      //         allowClear
      //         disabled={isLoading}
      //         prefix={<SearchOutlined />}
      //         // onPressEnter={onSearch}
      //         value={filter.keyword}
      //         onChange={handleFilter('keyword')}
      //       />
      //     </Col>
      //     <Col xs={24} lg={8}></Col>
      //   </Row>
      // }
    >
      <Row gutter={8}>
        <Col xs={24} lg={10}>
          <Row gutter={8}>
            <Col xs={24} lg={13}>
              <Input
                placeholder="Nhập từ khoá"
                allowClear
                size="medium"
                color="#7C8DB5"
                disabled={isLoading}
                prefix={<SearchOutlined />}
                // onPressEnter={onSearch}
                value={filter.keyword}
                onChange={handleFilter('keyword')}
              />
            </Col>
            <Col xs={24} lg={11}></Col>
          </Row>
        </Col>
        <Col xs={24} flex="auto">
          <div className="d-flex justify-content-end">
            <Space>
              <CustomStyle width="130px">
                <Select
                  color="primary"
                  size="medium"
                  placeholder="Nền tảng"
                  value={filter?.platform || 0}
                  onSelect={handleFilter('platform', true)}
                  // filterOption={(input, option) =>
                  //   option.props.children
                  //     .toLowerCase()
                  //     .indexOf(input.toLowerCase()) >= 0
                  // }
                >
                  <Option value={0}>Nền tảng</Option>
                  {constants?.SALE_CHANNEL.filter(item =>
                    ['LAZADA', 'SHOPEE'].includes(item.id),
                  )?.map(v => (
                    <Option value={v.id.toLowerCase()}>{v.name}</Option>
                  ))}
                </Select>
              </CustomStyle>
              <CustomStyle width="130px">
                <Select
                  color="primary"
                  size="medium"
                  placeholder="Cửa hàng"
                  value={filter?.store_id || 0}
                  onSelect={handleFilter('store_id', true)}
                  // filterOption={(input, option) =>
                  //   option.props.children
                  //     .toLowerCase()
                  //     .indexOf(input.toLowerCase()) >= 0
                  // }
                >
                  <Option value={0}>Cửa hàng</Option>
                  {listStores?.map(v => (
                    <Option value={v.id}>{v.name}</Option>
                  ))}
                </Select>
              </CustomStyle>
              <CustomStyle width="110px">
                <Select
                  color="primary"
                  size="medium"
                  placeholder="Trạng Thái"
                  value={filter?.status || 0}
                  onSelect={handleFilter('status', true)}
                  // filterOption={(input, option) =>
                  //   option.props.children
                  //     .toLowerCase()
                  //     .indexOf(input.toLowerCase()) >= 0
                  // }
                >
                  <Option value={0}>Tất cả</Option>
                  {constants?.PRODUCT_STATUS?.map(v => (
                    <Option value={v.id}>{v.name}</Option>
                  ))}
                </Select>
              </CustomStyle>
            </Space>
          </div>
        </Col>
      </Row>
    </Filter>
  );
});

export default FilterBar;
