import React, { memo, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Row, Col, Space, Tabs, Tooltip } from 'antd';
import { Form, Input, Select, DatePicker, Button } from 'app/components';
import { SearchOutlined } from '@ant-design/icons';
import Filter from 'app/hooks/Filter';

import { selectSelectedOrders } from '../slice/selectors';
import constants from 'assets/constants';
import moment from 'moment';
import { CustomStyle } from 'styles/commons';
import { GetTime } from 'utils/helpers';
import { defaultImage } from 'assets/images';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const initState = {
  keyword: '',
  status: '',
  store_id: '',
  from_date: '',
  to_date: '',
  odii_status: 0,
  fulfillment_status: '',
  platform: '',
};

const FilterBar = memo(function FilterBar({
  isLoading,
  history,
  showAction,
  listStores,
  summary,
  tab,
  batchActionHandler,
}) {
  const [filter, setFilter] = React.useState(initState);
  const [form] = Form.useForm();
  const [time, setTime] = React.useState();
  const selectedOrders = useSelector(selectSelectedOrders);

  const ref = useRef(null);

  useEffect(() => {
    form.setFieldsValue({ keyword: filter.keyword });
    tab(filter.odii_status + '-' + filter.fulfillment_status);
  }, [filter]);

  useEffect(() => {
    if (history.location.search == '?page=1&page_size=10') {
      let values = { ...filter, odii_status: 2, fulfillment_status: 'pending' };
      ref.current.callBack(values);
      setFilter(values);
    }
  }, []);

  const handleFilter = (type, needRefresh) => e => {
    const value = (e?.target?.value ?? e) || '';
    const values = { ...filter, [type]: value };
    if (type === 'odii_status' && value != 2) {
      values.fulfillment_status = '';
    }
    if (type === 'odii_status' && value == 2 && !value.fulfillment_status) {
      values.fulfillment_status = 'pending';
    }
    if (e.type === 'click' || needRefresh) {
      if (ref.current) {
        ref.current.callBack(values);
      }
    }
    setFilter(values);
  };

  const setTimeRanger = value => {
    let values = {};
    if (typeof value === 'string') {
      setTime(value);
      if (!GetTime(value)) {
        values = {
          ...filter,
          from_date: '',
          to_date: '',
        };
      } else {
        values = {
          ...filter,
          from_date: moment(GetTime(value)?.[0]).format('YYYY-MM-DD'),
          to_date: moment(GetTime(value)?.[1]).format('YYYY-MM-DD 23:59'),
        };
      }
    } else {
      values = {
        ...filter,
        from_date: moment(value?.[0]).format('YYYY-MM-DD'),
        to_date: moment(value?.[1]).format('YYYY-MM-DD 23:59'),
      };
    }
    ref.current.callBack(values);
  };

  // const changeKeyword = useCallback(
  //   debounce(() => {
  //     form.validateFields().then(formValues => {
  //       const values = { ...filter, ...formValues };
  //       if (ref.current) {
  //         ref.current.callBack(values);
  //         setFilter(values);
  //       }
  //     });
  //   }, 250),
  //   [],
  // );

  const countStatus = id => {
    const itemCount = summary?.find(item => item.order_status == id);
    return itemCount?.record_cnt;
  };

  return (
    <Filter
      initState={initState}
      filter={filter}
      setFilter={setFilter}
      ref={ref}
    >
      <Tabs
        onChange={handleFilter('odii_status', true)}
        activeKey={filter?.odii_status ? filter?.odii_status : ''}
      >
        {constants?.ORDER_FILTER_STATUS.map(v => {
          if ([1, 2, 3, 4].includes(v.id)) {
            return (
              <>
                <TabPane
                  // tab={`${v.name} (${countStatus(v.id) || 0})`}
                  tab={
                    <Tooltip title={v.tooltip}>
                      {v.name} ({countStatus(v.id) || 0})
                    </Tooltip>
                  }
                  key={v.id}
                ></TabPane>
              </>
            );
          } else {
            return (
              <>
                {/* <TabPane tab={v.name} key={v.id}></TabPane> */}
                <TabPane
                  tab={<Tooltip title={v.tooltip}>{v.name}</Tooltip>}
                  key={v.id}
                ></TabPane>
              </>
            );
          }
        })}
      </Tabs>
      {/** Chờ xử lý thì hiển thị sub tab trạng thái xác nhận đơn từ seller và supplier */}
      {filter?.odii_status == constants.ODII_ORDER_STATUS.PENDING && (
        <Tabs
          onChange={handleFilter('fulfillment_status', true)}
          activeKey={
            filter?.fulfillment_status ? filter?.fulfillment_status : ''
          }
        >
          {constants?.ORDER_FILTER_WAITCONFIRM_STATUS.map(v => {
            return (
              <>
                <TabPane
                  tab={`${v.name} (${countStatus(v.id) || 0})`}
                  key={v.id}
                ></TabPane>
              </>
            );
          })}
        </Tabs>
      )}

      <Row gutter={8}>
        <Col xs={24} lg={6}>
          <Form name="keyword" form={form}>
            <Form.Item
              name="keyword"
              rules={[
                {
                  min: 2,
                  message: 'Nội dung tìm kiếm ít nhất 2 ký tự',
                },
              ]}
            >
              <Input
                placeholder="Mã đơn, hóa đơn, tên khách hàng"
                allowClear
                size="medium"
                color="primary"
                disabled={isLoading}
                prefix={<SearchOutlined />}
                value={filter.keyword}
                onChange={handleFilter('keyword')}
              />
            </Form.Item>
          </Form>
        </Col>
        <Col xs={24} flex="auto">
          <div className="d-flex">
            <Space>
              <CustomStyle width="130px">
                <Select
                  color="primary"
                  size="medium"
                  value={filter?.platform || 0}
                  onSelect={handleFilter('platform', true)}
                >
                  <Option value={0}>Nền tảng</Option>
                  {constants?.SALE_CHANNEL.filter(item =>
                    ['LAZADA', 'SHOPEE', 'TIKTOK', 'OTHER'].includes(item.id),
                  )?.map(v => (
                    <Option value={v.id.toLowerCase()} key={v.id}>
                      <img
                        src={v?.icon}
                        alt=""
                        style={{ maxWidth: '100%', marginRight: 5 }}
                        width={15}
                      />
                      {v.name}
                    </Option>
                  ))}
                </Select>
              </CustomStyle>
              <CustomStyle width="150px">
                <Select
                  color="primary"
                  size="medium"
                  value={filter?.store_id || 0}
                  onSelect={handleFilter('store_id', true)}
                >
                  <Option value={0}>Cửa hàng</Option>
                  {listStores?.map(v => {
                    return (
                      <>
                        {constants?.SALE_CHANNEL.map(item => {
                          if (item.id.toLowerCase() == v.platform) {
                            return (
                              <Option value={v.id} key={v.id}>
                                <img
                                  src={item?.icon ?? defaultImage}
                                  alt=""
                                  style={{ maxWidth: '100%', marginRight: 5 }}
                                  width={15}
                                />
                                {v.name}
                              </Option>
                            );
                          }
                        })}
                      </>
                    );
                  })}
                </Select>
              </CustomStyle>
              <CustomStyle width="180px">
                <Select
                  color="primary"
                  size="medium"
                  onSelect={setTimeRanger}
                  value={time || 'day'}
                >
                  {constants?.ORDER_FILTER_TIME.map(v => (
                    <Option
                      style={{
                        background: v.id == 'day' && '#3D56A6',
                        color: v.id == 'day' && '#fff',
                        fontWeight: v.id == 'day' && 'normal',
                      }}
                      key={v.id}
                      value={v.id}
                    >
                      {v.name}
                    </Option>
                  ))}
                </Select>
              </CustomStyle>
              <CustomStyle w="130px">
                <RangePicker
                  disabled={filter.from_date || time == 'day'}
                  color="primary"
                  className="range-picker"
                  format="DD/MM/YYYY"
                  // size="large"
                  // onOpenChange={onOpenChange}
                  value={[
                    filter.from_date && moment(filter.from_date),
                    filter.to_date && moment(filter.to_date),
                  ]}
                  onChange={setTimeRanger}
                />
              </CustomStyle>
            </Space>
          </div>
        </Col>
      </Row>
      {selectedOrders?.hasAction && (
        <Row gutter={[8, 8]} style={{ marginBottom: 10 }}>
          <Col xs={24} style={{ display: 'flex' }}>
            {selectedOrders?.metadata &&
              constants.ORDER_ACTION_TYPE_NAME.map(type => {
                if (
                  selectedOrders?.metadata[type.count_name] &&
                  selectedOrders?.metadata[type.count_name] > 0
                ) {
                  return (
                    <Button
                      className="btn-sm"
                      style={{ marginRight: '10px' }}
                      onClick={
                        () => {
                          if (batchActionHandler) {
                            batchActionHandler(type, selectedOrders?.items);
                          }
                        }
                        // onClickActionButton(type, selectedOrders?.items)
                      }
                    >
                      {`${type.name} (${
                        selectedOrders?.metadata[type.count_name]
                      })`}
                    </Button>
                  );
                }
                return null;
              })}
          </Col>
        </Row>
      )}
    </Filter>
  );
});

export default FilterBar;
