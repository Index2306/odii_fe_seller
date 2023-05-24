import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Row, Col, Spin } from 'antd';
import { selectCurrentUser } from 'app/pages/AppPrivate/slice/selectors';
import { useDispatch, useSelector } from 'react-redux';
import request from 'utils/request';
import { isEmpty } from 'lodash';
import { RightOutlined } from '@ant-design/icons';
import { PageWrapper, Button } from 'app/components';
import { SectionWrapper, CustomStyle } from 'styles/commons';
// import Color from 'color';
import { StyleConstants, BackgroundImage } from 'styles/StyleConstants';
import { affiliateInvite, contact, support } from 'assets/images/dashboards';
import { Order, Stepbystep, Bystep } from './Features';
import moment from 'moment';
import ImageSvg from './image';
import ImportantWork from './Features/ImportantWork';
import ChartSell from './Features/ChartSell';
import TopProduct from './Features/TopProduct';
import { formatMoney, GetTime } from 'utils/helpers';
import PayBox from './Features/PayBox';
import { Link } from 'react-router-dom';
import { selectDataStatisticalAffiliate } from '../Affiliate/slice/selectors';
import { useAffiliateSlice } from '../Affiliate/slice';

const FAKE_NEWS = [
  {
    title:
      'Hệ thống Odii chính thức phát hành phiên bản Odii Seller 2.0 - Nâng cấp trải nghiệm người dùng',
    link: 'https://odii.vn/blog',
    created_at: '10/01/2022',
    time_read: '4 phút đọc',
  },
  {
    title:
      'Shopee ra mắt hệ thống hỗ trợ nhà bán hàng trong mùa dịch Covid-19 2021',
    link: 'https://odii.vn/blog',
    created_at: '10/01/2021',
    time_read: '4 phút đọc',
  },
  {
    title: 'Chính sách Odii hỗ trợ quý khách hàng mùa Covid-19',
    link: 'https://odii.vn/blog',
    created_at: '10/01/2021',
    time_read: '5 phút đọc',
  },
];

export function Dashboard({ history }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { actions } = useAffiliateSlice();
  // const userInfo = useSelector(selectCurrentUser);
  const dataStatisticalAffiliate = useSelector(selectDataStatisticalAffiliate);
  const [steps, setSteps] = useState({});
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [DoneSteps, setDoneSteps] = useState(true);
  const [today, setToday] = useState(null);

  // useEffect(() => {
  //   const getNews = async () => {
  //     const headers = {
  //       'Content-Type': 'application/json',
  //       Authorization:
  //         'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJpbnRlZ3JhdGUtYXBwIiwiaWF0IjpbMTY0MTE3NTYyNSwiMTY0MTE3NTYyNSJdLCJleHAiOjE2NzI3MTE2MjUsImF1ZCI6Im9kaWkudm4iLCJzdWIiOiJob2FuZ3R1YW4udmFsQGdtYWlsLmNvbSIsImlkIjoiMSIsIndlYnNpdGUiOiJvZGlpLnZuIn0.1bYK5yBcx3-S4fFKUHeG1zIFfqwkTdAQSbjL_HKAgbM',
  //     };
  //     await fetch('https://odii.vn/wp-json/odii-api/v1/posts?limit=3', {
  //       method: 'GET',
  //       // credentials: 'include',
  //       headers,
  //     })
  //       .then(result => result.json())
  //       .then(data => {
  //         setDataNews(data);
  //       })
  //       .catch(err => {
  //         console.log(err);
  //         setDataNews(FAKE_NEWS);
  //       });
  //   };
  //   getNews();
  // }, []);

  useEffect(() => {
    getSteps();
    getData();
    getToday({
      from_time: moment(GetTime('today')?.[0]).format('YYYY-MM-DD'),
      to_time: moment(GetTime('today')?.[1]).format('YYYY-MM-DD 23:59'),
    });
    dispatch(actions.getDataStatisticalAffiliate({}));
  }, []);

  const getToday = params => {
    request(`oms/seller/order-stats-by-days`, { params }).then(result => {
      setToday(result.data_detail[0]);
    });
  };

  const getSteps = params => {
    setIsLoading(true);
    request(`product-service/seller/connect-platform/step-by-step`, {})
      .then(result => {
        setIsLoading(false);
        setSteps(result?.data ?? {});
      })
      .catch(err => {
        setIsLoading(false);
      });
  };

  const getData = params => {
    setIsLoading(true);
    request(`oms/seller/order-stats-by-time`, { params })
      .then(result => {
        setIsLoading(false);
        setData(result?.data ?? {});
      })
      .catch(err => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (!isEmpty(steps)) {
      if (
        steps?.connect_store &&
        steps?.find_product &&
        steps?.sell_product &&
        steps.wallet_money
      ) {
        setDoneSteps(true);
      } else {
        setDoneSteps(false);
      }
    }
  }, [steps]);

  return (
    <CustomPageWrapper fixWidth>
      <Spin tip="Đang tải..." spinning={isLoading}>
        {/* <Banner>
          <svg
            className="background-header"
            width="1000"
            height="120"
            viewBox="0 0 1000 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              width="1000"
              height="120"
              rx="4"
              fill="url(#paint0_linear_2_95323)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_2_95323"
                x1="130"
                y1="-2.48875e-05"
                x2="979.793"
                y2="201.215"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4D7CC2" />
                <stop offset="1" stopColor="#3D56A6" />
              </linearGradient>
            </defs>
          </svg>
          <div className="svg-image">
            <ImageSvg />
          </div>
          <div className="image-text">
            <CustomStyle mb={{ xs: 's2' }}>
              Xin chào {userInfo?.full_name},
            </CustomStyle>
            <CustomStyle fontWeight="medium" fontSize={{ xs: 'f5' }}>
              Chào mừng bạn đến với hệ thống Odii - Seller.
            </CustomStyle>
          </div>
          <div className="image-icon">
            <svg
              width="13"
              height="13"
              viewBox="0 0 13 13"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                opacity="0.6"
                d="M10.9375 0.625H1.3125C0.574219 0.625 0 1.22656 0 1.9375V11.5625C0 12.3008 0.574219 12.875 1.3125 12.875H10.9375C11.6484 12.875 12.25 12.3008 12.25 11.5625V1.9375C12.25 1.22656 11.6484 0.625 10.9375 0.625ZM2.51562 7.84375C2.32422 7.84375 2.1875 7.70703 2.1875 7.51562V5.98438C2.1875 5.82031 2.32422 5.65625 2.51562 5.65625H9.73438C9.89844 5.65625 10.0625 5.82031 10.0625 5.98438V7.51562C10.0625 7.70703 9.89844 7.84375 9.73438 7.84375H2.51562Z"
                fill="white"
              />
            </svg>
          </div>
        </Banner> */}
        <SmallBanner>
          <Row align="middle">
            <Col span={12}>
              <div className="title-header">Doanh thu hôm nay</div>
              {today?.order_cnt > 0 ? (
                <div className="revenue">
                  {formatMoney(today?.revenue)}{' '}
                  <span>/ {today?.order_cnt} đơn hàng</span>
                </div>
              ) : (
                <div className="revenue">
                  <span style={{ fontSize: '18px' }}>
                    Chưa có đơn hàng nào hoàn thành !
                  </span>
                </div>
              )}
            </Col>
            <Col span={12}>
              <Row justify="end">
                <Link to="/affiliate?page=1">
                  <div className="invite">
                    <div className="icon">
                      <img src={affiliateInvite} alt="" />
                    </div>
                    <div className="text">
                      Tăng thu nhập cùng Affiliate
                      <div className="text-line">
                        Bạn đã giới thiệu được{' '}
                        {dataStatisticalAffiliate?.number_of_Affs} người bán
                      </div>
                    </div>
                    <RightOutlined />
                  </div>
                </Link>
              </Row>
            </Col>
          </Row>
        </SmallBanner>
        {!DoneSteps && (
          <Bystep
            steps={steps}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        )}
        <ImportantWork data={data || {}} />
        <ChartSell />
        <TopProduct data={data || {}} />
        <PayBox />
        {/* {DoneSteps && (
          <Order
            steps={steps}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        )}
        <Bystep
          steps={steps}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        /> */}
        {/* {!DoneSteps && (
          <Stepbystep
            steps={steps}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        )} */}
      </Spin>
    </CustomPageWrapper>
  );
}

const SmallBanner = styled.div`
  margin-bottom: 40px;

  .title-header {
    font-weight: 400;
    font-size: 18px;
    line-height: 21px;
    text-transform: uppercase;
    color: #757575;
  }
  .revenue {
    font-weight: 500;
    font-size: 32px;
    line-height: 38px;
    color: #1d1d1d;

    span {
      font-weight: 400;
      font-size: 22px;
      line-height: 26px;
      color: #888888;
    }
  }
  .invite {
    display: flex;
    align-items: center;
    background: #ffffff;
    border-radius: 56px;
    padding: 10px 19px;
    cursor: pointer;

    &:hover {
      box-shadow: 0px 3px 8px rgb(0 0 0 / 20%);
    }

    .icon {
      margin-right: 12.62px;
      width: 16.83px;
    }
    .text {
      font-weight: 500;
      font-size: 14px;
      line-height: 16px;
      color: #000;

      .text-line {
        font-weight: 400;
        font-size: 12px;
        line-height: 14px;
        color: #828282;
      }
    }
    .anticon-right {
      margin-left: 38px;
    }
  }
`;

const CustomPageWrapper = styled(PageWrapper)`
  width: ${StyleConstants.bodyWidth}px;
`;

const Banner = styled.div`
  color: #fff;
  display: flex;
  height: 120px;
  justify-content: center;
  flex-direction: column;
  margin-bottom: 35px;

  .background-header {
    position: relative;
  }
  .svg-image {
    position: absolute;
    right: 80px;
  }
  .image-text {
    position: absolute;
    left: 56px;
  }
  .image-icon {
    position: absolute;
    right: 14px;
    top: 12px;
  }
`;
