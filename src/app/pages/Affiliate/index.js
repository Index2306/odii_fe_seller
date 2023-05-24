/**
 *
 * Affiliate
 *
 */
import React from 'react';
import { useSelector } from 'react-redux';
// import { useTranslation } from 'react-i18next';
// import { isEmpty } from 'lodash';
import {
  // Button,
  PageWrapper,
  // Table,
  // BoxColor,
  // EmptyPage,
  // Avatar,
  Tabs,
} from 'app/components';
import // Row,
// Col,
// Spin,
//  Popover, Divider
// Tabs,
'antd';
import {
  // CustomTitle,
  CustomH3,
  CustomTitle,
  // CustomStyle,
  SectionWrapper,
  // CustomStyle,
} from 'styles/commons';
import {
  selectLoading,
  // selectData,
  // selectPagination,
  // selectShowEmptyPage,
} from './slice/selectors';
// import { useAffiliateSlice } from './slice';
// import styled from 'styled-components/macro';
// import constants from 'assets/constants';
// import request from 'utils/request';
// import { FilterBar } from './Features';
// import { formatDate, formatVND } from 'utils/helpers';
import { MyInfoAffiliate, ListCommission, ListSeller } from './Components';

const { TabPane } = Tabs;

export function Affiliate({ history }) {
  // const { t } = useTranslation();
  // const dispatch = useDispatch();
  // const { actions } = useAffiliateSlice();
  const isLoading = useSelector(selectLoading);
  // const pagination = useSelector(selectPagination);
  // const data = useSelector(selectData);
  // const showEmptyPage = useSelector(selectShowEmptyPage);

  // const gotoPage = (data = '', isReload) => {
  //   dispatch(actions.getData(isReload ? history.location.search : data));
  // };

  // const rowSelection = {
  //   onChange: selectedRowKeys => {
  //     dispatch(actions.setListSelected(selectedRowKeys));
  //   },
  // };

  // if (showEmptyPage) {
  //   return (
  //     <>
  //       <PageWrapper>
  //         <MyInfoAffiliate />
  //         <CustomTitle
  //           height="calc(100vh - 120px)"
  //           className="d-flex flex-column"
  //         >
  //           <CustomTitle>Tiếp thị người dùng</CustomTitle>
  //           <EmptyPage />
  //         </CustomTitle>
  //       </PageWrapper>
  //     </>
  //   );
  // }

  return (
    <>
      <PageWrapper>
        <CustomTitle>Affiliate</CustomTitle>
        <MyInfoAffiliate />
        <SectionWrapper>
          {/* <div className="header">
            <CustomH3 className="title text-left" mb={{ xs: 's4' }}>
              Tổng quan tiếp thị
            </CustomH3>
          </div> */}
          <Tabs defaultActiveKey="1">
            <TabPane tab="Doanh thu hoa hồng" key="1">
              <ListCommission isLoading={isLoading} />
            </TabPane>
            <TabPane tab="Danh sách Seller" key="2">
              <ListSeller isLoading={isLoading} />
            </TabPane>
          </Tabs>
        </SectionWrapper>
      </PageWrapper>
    </>
  );
}
