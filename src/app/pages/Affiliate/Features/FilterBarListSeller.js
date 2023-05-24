import React, { memo, useRef, useState } from 'react';
import { Row, Col, Space, Button } from 'antd';
import { Input, Select, DatePicker } from 'app/components';
import { SearchOutlined, DownloadOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { CustomStyle } from 'styles/commons';
// import Filter from 'app/hooks/Filter';
import moment from 'moment';
import constants from 'assets/constants';

const { Option } = Select;
const { RangePicker } = DatePicker;

export const DEFAULT_FILTER = {
  page: 1,
  page_size: 10,
  keyword: '',
  register_from: '',
  register_to: '',
  // affiliate_status: '',
  account_status: '',
};

const LIST_ACCOUNT_STATUS_ID = ['active', 'inactive'];

const FilterBar = memo(function FilterBar({ isLoading, filter, updateFilter }) {
  const onChangeField = fieldName => e => {
    const newValue = (e?.target?.value ?? e) || '';
    updateFilter({ [fieldName]: newValue });
  };

  const onChangeTimeRanger = value => {
    const data = {
      register_from: value?.[0].startOf('day').toISOString(true),
      register_to: value?.[1].endOf('day').toISOString(true),
    };
    updateFilter(data);
  };

  const account_status = constants?.ACCOUNT_STATUS?.filter(status =>
    LIST_ACCOUNT_STATUS_ID.includes(status.id),
  );

  return (
    <Div>
      <Row gutter={[8, 8]}>
        <Col xs={24} xl={8}>
          <Input
            allowClear
            style={{ width: '100%' }}
            placeholder="Nhập tên hoặc email Seller"
            disabled={isLoading}
            prefix={<SearchOutlined />}
            value={filter.keyword}
            size="medium"
            onChange={onChangeField('keyword')}
          />
        </Col>
        <Col xs={24} flex="auto">
          <div className="d-flex justify-content-end">
            <Space>
              <CustomStyle>
                <RangePicker
                  color="primary"
                  className="range-picker"
                  format="DD/MM/YYYY"
                  // size="large"
                  // onOpenChange={onOpenChange}
                  style={{ width: 300 }}
                  value={[
                    filter.register_from && moment(filter.register_from),
                    filter.register_to && moment(filter.register_to),
                  ]}
                  placeholder={['Đăng ký từ ngày', 'Đến ngày']}
                  onChange={onChangeTimeRanger}
                />
              </CustomStyle>
              {/* <CustomStyle>
                  <Select
                    color="primary"
                    value={filter?.affiliate_status || 0}
                    onSelect={changeFilter('affiliate_status', true)}
                    size="medium"
                    style={{ width: 200 }}
                  >
                    <Option value={0}>Tất cả trạng thái tiếp thị</Option>
                    {constants?.AFFILIATE_STATUS?.map(v => (
                      <Option value={v.id}>{v.name}</Option>
                    ))}
                  </Select>
                </CustomStyle> */}
              <CustomStyle>
                <Select
                  color="primary"
                  value={filter?.account_status || 0}
                  onSelect={onChangeField('account_status')}
                  size="medium"
                  style={{ width: 210 }}
                >
                  <Option value={0}>Tất cả trạng thái tài khoản</Option>
                  {account_status.map(v => (
                    <Option value={v.id}>{v.name}</Option>
                  ))}
                </Select>
              </CustomStyle>
              <CustomStyle w="94px">
                <ButtonExport context="secondary" className="btn-sm">
                  Export
                  <DownloadOutlined />
                </ButtonExport>
              </CustomStyle>
            </Space>
          </div>
        </Col>
      </Row>
    </Div>
    // </Filter>
  );
});
const Div = styled.div`
  .ant-input-prefix {
    color: #6489ff;
  }
  .anticon-search {
    vertical-align: 0;
    color: #7c8db5;
  }
  .ant-input {
    color: #7c8db5;
    &::placeholder {
      color: #7c8db5;
    }
  }
  .ant-picker-input {
    input {
      font-weight: 500;
    }
  }
  .ant-select-selection-item {
    font-weight: 500;
  }
`;
const ButtonExport = styled(Button)`
  padding: ${({ theme }) => theme.space.s4 / 2}px
    ${({ theme }) => theme.space.s4}px!important;
  line-height: ${({ theme }) => theme.lineHeight}!important;
  height: auto !important;
  color: ${({ theme }) => theme.primary}!important;
  font-weight: 600;
  border-radius: ${({ theme }) => theme.radius}px;
  border: solid 1px ${({ theme }) => theme.stroke}!important;
  .anticon {
    vertical-align: 0;
  }
`;
export default FilterBar;
