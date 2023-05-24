import React from 'react';
import { Button, EmptyPage } from 'app/components';
import StoreListing from './components/Listing';
import { Spin } from 'antd';
import notification from 'utils/notification';
import * as Store from './styles';
import { useDispatch, useSelector } from 'react-redux';
import { useStoresSlice } from './slice';
import { selectShowEmptyPage, selectLoading } from './slice/selectors';
import {
  selectAccessToken,
  selectCurrentUser,
} from 'app/pages/AppPrivate/slice/selectors';
import { useLocation } from 'react-router-dom';
import {
  // ShopifyIcon,
  ShopeeIcon,
  LazadaIcon,
  // WooCommerceIcon,
  TiktokIcon,
} from 'assets/images/platform';
import { CustomStyle } from 'styles/commons';
import request from 'utils/request';
import { redirectToConnectPlatform } from './utils';
const initialSearchParams = {
  page: 1,
  page_size: 10,
};

const lazadaUrl = `https://api.lazada.com/oauth/authorize?response_type=code&force_auth=true&redirect_uri=${process.env.REACT_APP_PORTAL_URL}/connect-sale-channel/lazada&client_id=${process.env.REACT_APP_LAZADA_CLIENT_ID}&country=vn`;

const platforms = [
  // { key: 'shopify', name: 'Shopify', icon: ShopifyIcon, isActive: false },
  // {
  //   key: 'woocommerce',
  //   name: 'Woocommerce',
  //   icon: WooCommerceIcon,
  //   isActive: false,
  // },
  { key: 'shopee', name: 'Shopee', icon: ShopeeIcon, isActive: true },
  { key: 'lazada', name: 'Lazada', icon: LazadaIcon, isActive: true },
  { key: 'tiktok', name: 'Tiktok', icon: TiktokIcon, isActive: true },
];

export function Stores() {
  const [searchParams, setSearchParams] = React.useState(initialSearchParams);
  const [isShowModal, setIsShowModal] = React.useState(false);
  const [urlIframe, setUrlIframe] = React.useState('');

  const location = useLocation();
  const showEmptyPage = useSelector(selectShowEmptyPage);
  const isLoading = useSelector(selectLoading);
  const currentUser = useSelector(selectCurrentUser);
  const AccessToken = useSelector(selectAccessToken);

  const dispatch = useDispatch();
  const { actions } = useStoresSlice();

  React.useEffect(() => {
    if (!location.search) {
      setSearchParams(initialSearchParams);
    } else {
      const searchObject = Object.fromEntries(
        new URLSearchParams(location.search),
      );

      const newSearchParams = {};

      Object.keys(searchObject).forEach(key => {
        newSearchParams[key] = searchObject[key];
      });

      setSearchParams(newSearchParams);
    }
    return () => {
      dispatch(actions.resetWhenLeave());
    };
  }, []);

  React.useEffect(() => {
    dispatch(actions.getStoresList(searchParams));
  }, [searchParams]);

  React.useEffect(() => {
    if (urlIframe) {
      const iframe = document.getElementById('ifr');
      iframe.addEventListener('load', handleLoad(iframe), true);
      return () => {
        iframe.removeEventListener('load', handleLoad(iframe), true);
      };
    }
  }, [urlIframe]);

  const handleLoad = iframe => {
    const windowIframe = iframe.contentWindow;
    const data = {
      type: 'SENT_TO_IFRAME',
      tenant_id: currentUser?.subscription?.tenant_id,
      url_platform: urlIframe,
      accessToken: AccessToken,
      tenant_domain: window.location.href,
    };
    if (windowIframe) {
      windowIframe.postMessage(data, process.env.REACT_APP_PORTAL_URL);
    }
  };

  const handleToggleModal = () => {
    setIsShowModal(!isShowModal);
  };

  const getAuthUrl = type => () => {
    if (type === 'shopee') {
      dispatch(actions.setLoading(true));
      request('/sales-channels-service/shopee/get-auth-url', {})
        .then(result => {
          dispatch(actions.setLoading(false));
          if (result.is_success) {
            redirectToConnectPlatform(type, result.data.url);
            handleToggleModal();
            setUrlIframe(result.data.url);
          } else {
            notification(
              'error',
              // err?.error_code,
              'Có lỗi xảy ra, Vui lòng kết nối lại sau!',
              7,
            );
          }
        })
        .catch(err => {
          notification(
            'error',
            err?.error_code,
            'Có lỗi xảy ra, Vui lòng kết nối lại sau!',
            7,
          );

          dispatch(actions.setLoading());
        });
    } else if (type === 'tiktok') {
      dispatch(actions.setLoading(true));
      request('/sales-channels-service/tiktok/get-auth-url', {})
        .then(result => {
          dispatch(actions.setLoading(false));
          if (result.is_success) {
            redirectToConnectPlatform(type, result.data.url);
            handleToggleModal();
            setUrlIframe(result.data.url);
          } else {
            notification(
              'error',
              // err?.error_code,
              'Có lỗi xảy ra, Vui lòng kết nối lại sau!',
              7,
            );
          }
        })
        .catch(err => {
          notification(
            'error',
            err?.error_code,
            'Có lỗi xảy ra, Vui lòng kết nối lại sau!',
            7,
          );

          dispatch(actions.setLoading());
        });
    } else {
      redirectToConnectPlatform(type, lazadaUrl);
      handleToggleModal();
      setUrlIframe(lazadaUrl);
    }
  };

  return (
    <>
      <Store.Wrapper>
        {showEmptyPage ? (
          <EmptyPage>
            <CustomStyle className="d-flex justify-content-center">
              <Button
                className="btn-md"
                onClick={handleToggleModal}
                width="250px"
              >
                KẾT NỐI CỬA HÀNG NGAY
              </Button>
            </CustomStyle>
          </EmptyPage>
        ) : (
          <Store.PageWrapper>
            <Store.Header.Wrapper>
              <Store.Header.Title>Cửa hàng</Store.Header.Title>

              <Store.Header.Button>
                <Button
                  className="btn-sm"
                  // icon="far fa-plus"
                  onClick={handleToggleModal}
                >
                  <Store.Header.Icon>
                    <svg
                      width="11"
                      height="11"
                      viewBox="0 0 11 11"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10.3125 4.875H6.375V0.9375C6.375 0.71875 6.15625 0.5 5.9375 0.5H5.0625C4.81641 0.5 4.625 0.71875 4.625 0.9375V4.875H0.6875C0.441406 4.875 0.25 5.09375 0.25 5.3125V6.1875C0.25 6.43359 0.441406 6.625 0.6875 6.625H4.625V10.5625C4.625 10.8086 4.81641 11 5.0625 11H5.9375C6.15625 11 6.375 10.8086 6.375 10.5625V6.625H10.3125C10.5312 6.625 10.75 6.43359 10.75 6.1875V5.3125C10.75 5.09375 10.5312 4.875 10.3125 4.875Z"
                        fill="white"
                      />
                    </svg>
                  </Store.Header.Icon>
                  <Store.Header.Text>Kết nối cửa hàng</Store.Header.Text>
                </Button>
              </Store.Header.Button>
            </Store.Header.Wrapper>

            <Spin tip="Đang tải..." spinning={isLoading}>
              <Store.Body>
                <StoreListing setUrlIframe={value => setUrlIframe(value)} />
              </Store.Body>
            </Spin>
          </Store.PageWrapper>
        )}

        <Store.Modal.Wrapper
          visible={isShowModal}
          onCancel={handleToggleModal}
          closeIcon={<i className="far fa-times" />}
          footer={null}
          width={540}
          height={269}
        >
          <Store.Modal.Title>Thêm cửa hàng</Store.Modal.Title>

          <Store.Modal.Desc>
            Vui lòng chọn và kết nối với cửa hàng kinh doanh của bạn.
          </Store.Modal.Desc>

          <Store.Modal.PlatForm.List>
            {platforms.map(platform => (
              <Store.Modal.PlatForm.Item
                key={platform.key}
                onClick={getAuthUrl(platform.key)}
                // onClick={() => redirectToConnectPlatform(platform.key)}
              >
                <Store.Modal.PlatForm.Icon active={platform.isActive}>
                  <img src={platform.icon} alt="" />
                </Store.Modal.PlatForm.Icon>

                <Store.Modal.PlatForm.Name>
                  {platform.name}
                </Store.Modal.PlatForm.Name>
              </Store.Modal.PlatForm.Item>
            ))}
          </Store.Modal.PlatForm.List>
        </Store.Modal.Wrapper>
      </Store.Wrapper>
      <Store.Modal.Iframe>
        <iframe
          style={{ display: 'none' }}
          src={process.env.REACT_APP_PORTAL_URL}
          id="ifr"
        ></iframe>
      </Store.Modal.Iframe>
    </>
  );
}
