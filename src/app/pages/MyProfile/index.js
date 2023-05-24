/**
 *
 * MyProfile
 *
 */
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { Spin } from 'antd';
import { PageWrapper, Tabs } from 'app/components';
import { SectionWrapper } from 'styles/commons';
import { useMyProfileSlice } from './slice';
// import { useAuthSlice } from 'app/pages/Auth/slice';
import { selectLoading, selectData } from './slice/selectors';
import { messages } from './messages';
import styled from 'styled-components';
import MyInfo from './ComponentTab/MyInfo';
import Setting from './ComponentTab/Setting';
const { TabPane } = Tabs;

export function MyProfile({ history }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { actions } = useMyProfileSlice();
  // const { actions: authActions } = useAuthSlice();
  const isLoading = useSelector(selectLoading);
  const data = useSelector(selectData);

  useEffect(() => {
    dispatch(actions.getData({}));
  }, []);

  return (
    <>
      <CustomPageWrapper fixWidth>
        <Spin tip="Đang tải..." spinning={isLoading}>
          <div className="title">{t(messages.title())}</div>
          <Tabs defaultActiveKey="1">
            <TabPane tab="Cá nhân" key="1">
              <MyInfo data={data} />
            </TabPane>
            {/* <TabPane tab="Thông tin doanh nghiệp" key="2"></TabPane> */}
            <TabPane tab="Thiết lập" key="2">
              <Setting data={data} />
            </TabPane>
          </Tabs>
        </Spin>
      </CustomPageWrapper>
    </>
  );
}
const CustomPageWrapper = styled(PageWrapper)`
  .ant-tabs-nav {
    /* padding: 0 20px 24px; */
  }
  .ant-tabs-tab {
    padding: 0 0 12px;
    color: #6c798f;
  }

  .title {
    font-weight: 900;
    font-size: 22px;
    line-height: 26px;
    color: #3d56a6;
    margin-bottom: 24px;
  }
  .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
    font-weight: 500;
    font-size: 14px;
    line-height: 16px;
    color: #3d56a6;
  }
  .ant-tabs-ink-bar.ant-tabs-ink-bar-animated {
    height: 4px;
    background: #435ebe;
    border-radius: 6px 6px 0px 0px;
  }
`;
