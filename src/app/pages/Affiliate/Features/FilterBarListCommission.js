import React, { memo, useState, useRef, useEffect, useMemo } from 'react';
import { Row, Col, Space } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { Input, Select, DatePicker, Button } from 'app/components';
// import { isEmpty } from 'lodash';
import { SearchOutlined, DownloadOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { CustomStyle } from 'styles/commons';
import Filter from 'app/hooks/Filter';
import moment from 'moment';
import { useAffiliateSlice } from '../slice';
import { selectDataListPayout } from '../slice/selectors';
import { formatDateRange } from 'utils/helpers';
import { downloadFile } from 'utils/request';
// import constants from 'assets/constants';

const { Option } = Select;
const { RangePicker } = DatePicker;

const initState = {
  keyword: '',
  // from_time: '',
  // to_time: '',
  from_date: '',
  to_date: '',
  payout_affiliate_key: '',
};

const FilterBar = memo(function FilterBar({ isLoading }) {
  const ref = useRef(null);
  const dispatch = useDispatch();
  const { actions } = useAffiliateSlice();
  const listPeriodTime = useSelector(selectDataListPayout);

  const [filter, setFilter] = useState(initState);

  const listPayoutPeriodSelect = useMemo(
    () =>
      (listPeriodTime || []).map(period => ({
        text: formatDateRange(period.startDate, period.endDate),
        value: period.key,
      })),
    [listPeriodTime],
  );

  useEffect(() => {
    dispatch(actions.getDataListPayout());
  }, []);

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

  const setTimeRanger = value => {
    const values = {
      ...filter,
      from_date: value?.[0].startOf('day').toISOString(true),
      to_date: value?.[1].endOf('day').toISOString(true),
    };
    ref.current.callBack(values);
  };

  const exportFile = async () => {
    const requestUrl = 'user-service/partner-affiliate/exportListCommission';
    const dateFormat = 'YYYY-MM-DD-HH-mm-ss';
    const fileName = 'Commission-revenue';
    const unixName = moment().format(dateFormat);
    const separatorName = '-';
    const fileExt = '.xlsx';
    const fullName = fileName + separatorName + unixName + fileExt;
    await downloadFile(requestUrl, fullName);
  };

  return (
    <Filter
      initState={initState}
      filter={filter}
      setFilter={setFilter}
      ref={ref}
    >
      <Div>
        <Row gutter={[8, 8]}>
          <Col xs={24} xl={6}>
            <Input
              allowClear
              style={{ width: '100%' }}
              placeholder="Nhập mã đơn hàng"
              disabled={isLoading}
              prefix={<SearchOutlined />}
              value={filter.keyword}
              size="medium"
              onChange={handleFilter('keyword')}
            />
          </Col>
          <Col xs={24} flex="auto">
            <div className="d-flex justify-content-end">
              <Space>
                {/* <CustomStyle>
                  <RangePicker
                    color="primary"
                    className="range-picker"
                    format="DD/MM/YYYY"
                    style={{ width: 260 }}
                    value={[
                      filter.from_date && moment(filter.from_date),
                      filter.to_date && moment(filter.to_date),
                    ]}
                    placeholder={['Bắt đầu ngày', 'Kết thúc ngày']}
                    onChange={setTimeRanger}
                  />
                </CustomStyle> */}
                <CustomStyle>
                  <Select
                    // color="primary"
                    size="medium"
                    value={filter?.payout_affiliate_key || 0}
                    onSelect={handleFilter('payout_affiliate_key', true)}
                    style={{ width: 220 }}
                  >
                    <Option value={0}>Tất cả chu kỳ</Option>
                    {listPayoutPeriodSelect.map(
                      (payoutPeriod, index) => (
                        <Option
                          value={payoutPeriod.value}
                          key={payoutPeriod.value}
                        >
                          {payoutPeriod.text}
                        </Option>
                      ),
                      // ),
                    )}
                  </Select>
                </CustomStyle>
                <CustomStyle w="94px">
                  <Button
                    className="btn-export"
                    color="white"
                    onClick={exportFile}
                  >
                    <DownloadOutlined /> &nbsp; Export
                  </Button>
                </CustomStyle>
              </Space>
            </div>
          </Col>
        </Row>
      </Div>
    </Filter>
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
  .btn-export {
    height: 32px;
    font-size: 14px;
    font-weight: 500;
    background: #ffffff;
    border: 1px solid #ebebf0;
    box-sizing: border-box;
    box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.05);
    border-radius: 4px;
  }
`;
export default FilterBar;
