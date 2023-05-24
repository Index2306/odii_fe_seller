import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { isEmpty } from 'lodash';
import { getStores } from 'utils/providers';
import {
  Selldashbroad,
  RevenueBuy,
  ProductDeny,
  ProductAnalysis,
  ProductStatus,
} from './Features';
import { useAnalysisSlice } from './slice';
import { messages } from './messages';
import styled from 'styled-components';
import moment from 'moment';
import { GetTime } from 'utils/helpers';
import { Select, DatePicker, Tabs } from 'app/components';
import { CustomStyle } from 'styles/commons';
import { useLocation } from 'react-router-dom';
import constants from 'assets/constants';
import request from 'utils/request';
import { useOrdersSlice } from '../Orders/slice';
import { defaultImage } from 'assets/images';
import { selectListStores } from '../Orders/slice/selectors';

const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;

const tabsData = [
  {
    id: '0',
    name: 'Doanh thu & bán hàng',
  },
  {
    id: '1',
    name: 'Sản phẩm',
  },
];

const initState = {
  from_time: moment(GetTime('month')?.[0]).format('YYYY-MM-DD'),
  to_time: moment(GetTime('month')?.[1]).format('YYYY-MM-DD 23:59'),
  tabs: '0',
};

export function Analysis({ history }) {
  const { t } = useTranslation();
  const [deny, setDeny] = React.useState(null);
  const [revenue, setRevenue] = React.useState(null);
  const [data, setData] = React.useState(null);
  const [supplierRevenue, setSupplierRevenue] = React.useState(null);
  const [time, setTime] = React.useState('month');
  const [filter, setFilter] = React.useState(initState);
  const dispatch = useDispatch();
  const { actions } = useOrdersSlice();
  const listStores = useSelector(selectListStores);

  const location = useLocation();
  // const dispatch = useDispatch();
  // const { actions } = useAnalysisSlice();

  // React.useEffect(() => {
  //   getStores()
  //     .then(res => {
  //       console.log(res?.data)
  //       if (!isEmpty(res?.data)) dispatch(actions.setListStores(res?.data));
  //     })
  //     .catch(() => null);
  //   return () => {
  //     // dispatch(actions.resetWhenLeave());
  //   };
  // }, []);

  React.useEffect(() => {
    if (filter.from_time && filter.to_time) {
      if (!filter?.platform) {
        delete filter.platform;
      }
      getData(filter);
      getRevenue(filter);
      getDenyData(filter);
      getRevenueSupplier(filter);
    }
  }, [filter]);

  React.useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    let v = ['', ''];
    if (searchParams) {
      v = searchParams.toString().split('=');
    }
    const values = { ...filter, [v[0]]: v[1] };
    setFilter(values);
  }, []);

  const getData = params => {
    request(`/oms/seller/order-stats-by-days`, { params }).then(request => {
      if (request) setData(request);
    });
  };

  const getRevenue = params => {
    request(`/oms/seller/report-revenue-by-days`, { params }).then(request => {
      if (request) setRevenue(request);
    });
  };

  const getDenyData = params => {
    request(`/oms/seller/report-cancel-reason-by-days`, { params }).then(
      request => {
        if (request) setDeny(request);
      },
    );
  };

  const getRevenueSupplier = params => {
    request(`/oms/seller/report-revenue-supplier-by-days`, { params }).then(
      request => {
        if (request) setSupplierRevenue(request);
      },
    );
  };

  const setTimeRanger = value => {
    let values = {};
    if (typeof value === 'string') {
      setTime(value);
      if (!GetTime(value)) {
        values = {
          ...filter,
          from_time: '',
          to_time: '',
        };
      } else {
        values = {
          ...filter,
          from_time: moment(GetTime(value)?.[0]).format('YYYY-MM-DD'),
          to_time: moment(GetTime(value)?.[1]).format('YYYY-MM-DD 23:59'),
        };
      }
    } else {
      values = {
        ...filter,
        from_time: moment(value?.[0]).format('YYYY-MM-DD'),
        to_time: moment(value?.[1]).format('YYYY-MM-DD 23:59'),
      };
    }
    setFilter(values);
  };

  const handleChangStatus = value => {
    const values = { ...filter, tabs: value };
    setFilter(values);
    history.push(`${location.pathname}`);
  };

  return (
    <Wrapper>
      <CustomStyle className="header-page">
        <CustomStyle className="title">{t(messages.title())}</CustomStyle>
        <CustomStyle className="header-tabs">
          <Tabs
            defaultActiveKey={'0'}
            onChange={handleChangStatus}
            activeKey={filter?.tabs ? `${filter.tabs}` : '0'}
          >
            {tabsData.map(v => {
              return <TabPane tab={v.name} key={v.id}></TabPane>;
            })}
          </Tabs>
        </CustomStyle>
      </CustomStyle>
      <CustomPage>
        <CustomFilter>
          <CustomStyle className="mr-8">Khung thời gian :</CustomStyle>
          <CustomStyle width="180px" className="mr-8">
            <Select
              color="primary"
              size="medium"
              onSelect={setTimeRanger}
              value={time}
            >
              {constants?.ORDER_FILTER_TIME.map(v => (
                <Option
                  style={{
                    background: v.id === 'day' && '#3D56A6',
                    color: v.id === 'day' && '#fff',
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
              disabled={time && time !== 'custom'}
              color="primary"
              className="range-picker"
              format="DD/MM/YYYY"
              onChange={setTimeRanger}
              value={[
                filter.from_time && moment(filter.from_time),
                filter.to_time && moment(filter.to_time),
              ]}
            />
          </CustomStyle>
          {/* <CustomStyle className="mr-8" style={{ marginLeft: '15px' }}>Cửa hàng :</CustomStyle>
          <CustomStyle width="200px">
            <Select
              color="primary"
              size="medium"
              value={filter?.store_id || 0}
              onSelect={value => { value && setFilter({ ...filter, store_id: value }) }}
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
          </CustomStyle> */}
        </CustomFilter>
        {filter.tabs === '0' ? (
          <>
            <Selldashbroad
              dataDetail={data?.data_detail || []}
              dataSummary={revenue?.current_summary || {}}
              dataPrevent={revenue?.prevent_summary || {}}
              time={time}
            />
            <RevenueBuy
              dataTable={supplierRevenue?.data || []}
              dataDeny={deny?.data_deny || []}
              dataPie={revenue?.data_platform || []}
              setSearch={value => setFilter(value)}
              filter={filter}
              pagination={deny?.pagination || {}}
              gotoPage={value => getDenyData(value)}
              totalCancel={revenue?.current_summary.cancel_order_cnt}
            />
          </>
        ) : (
          <>
            <CustomCategory>
              <ProductStatus filter={filter} />
              <ProductAnalysis filter={filter} />
              <ProductDeny filter={filter} />
            </CustomCategory>
          </>
        )}
      </CustomPage>
      {/* <CustomTitle color="primary">{t(messages.title())}</CustomTitle>
      <Order />
      <TopProducts />
      <BarChartAnalysis /> */}
    </Wrapper>
  );
}

const CustomCategory = styled.div`
    .tablesell{
        padding: 24px 21.15px 26px;
        background: #FFFFFF;
        box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.05);
        border-radius: 4px;

        .header{
        margin-bottom: 20px;

        .see-more{
            display: flex;
            align-items: center;
            color: #3D56A6;

            &:hover{
                cursor: pointer;
                text-decoration: underline;
            }
        }
    }
`;

const Wrapper = styled.div`
  .header-page {
    background: #ffffff;
    padding: 24px 24px 0px;

    .title {
      font-weight: 600;
      font-size: 22px;
      line-height: 26px;
      color: #333333;
    }
  }
  .header-tabs {
    .ant-tabs-nav {
      margin: 0;
    }
    .ant-tabs-tab-active {
      font-weight: 500;
      font-size: 14px;
      line-height: 20px;

      .ant-tabs-tab-btn {
        color: #3d56a6 !important;
      }
    }
    .ant-tabs-ink-bar {
      background: #3d56a6 !important;
    }
    .ant-tabs-tab {
      font-weight: 500;
      font-size: 14px;
      line-height: 20px;
      color: #4f4f4f !important;
    }
  }
`;

const CustomPage = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 16px 25px 38px;
  max-width: 1210px;

  .title{
      color: #333333;
      font-weight: 500;
      font-size: 18px;
      line-height: 21px;
      display: flex;
      align-items: center;

      .small-title{
          font-weight: 400;
          font-size: 12px;
          line-height: 14px;
          color: #828282;
          margin-left: 8px;
      }
  }
  }
`;
const CustomFilter = styled.div`
  background: #ffffff;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  padding: 14px 24px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;

  .mr-8 {
    margin-right: 8px;
  }
`;
