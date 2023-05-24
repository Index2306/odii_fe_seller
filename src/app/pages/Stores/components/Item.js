import React from 'react';
import * as Store from '../styles';
import { redirectToConnectPlatform } from '../utils';

import {
  // ShopifyIcon,
  ShopeeIcon,
  LazadaIcon,
  // WooCommerceIcon,
  TiktokIcon,
} from 'assets/images/platform';
import { BoxColor, Button, Image } from 'app/components';
import notification from 'utils/notification';
import request from 'utils/request';
import { useDispatch } from 'react-redux';
import { useStoresSlice } from '../slice';

const { Item } = Store;

const platforms = [
  // { key: 'shopify', name: 'Shopify', icon: ShopifyIcon, isActive: false },
  // {
  //   key: 'woocommerce',
  //   name: 'Woocommerce',
  //   icon: WooCommerceIcon,
  //   isActive: false,
  // },
  {
    key: 'shopee',
    name: 'Shopee',
    icon: ShopeeIcon,
    color: '#EA501F',
    isActive: false,
  },
  {
    key: 'lazada',
    name: 'Lazada',
    icon: LazadaIcon,
    color: '#3D56A6',
    isActive: true,
  },
  {
    key: 'tiktok',
    name: 'Tiktok',
    icon: TiktokIcon,
    color: '#000',
    isActive: false,
  },
];

const lazadaUrl = `https://api.lazada.com/oauth/authorize?response_type=code&force_auth=true&redirect_uri=${process.env.REACT_APP_PORTAL_URL}/connect-sale-channel/lazada&client_id=${process.env.REACT_APP_LAZADA_CLIENT_ID}&country=vn`;

const STATUS = [
  { id: 'active', name: 'Đang kết nối', color: 'greenMedium1' },
  {
    id: 'pending_for_disconnect',
    name: 'Đang chờ ngắt kết nối',
    color: 'orange',
  },
  { id: 'inactive', name: 'Ngắt kết nối', color: 'secondary2' },
  { id: 'pending_for_delete', name: 'Đang chờ xóa', color: 'grayBlue' },
];

export default function StoreItems(props) {
  const dispatch = useDispatch();
  const { actions } = useStoresSlice();

  const genPlatformIcon = platform => {
    const currentPlatform = platforms.find(item => item.key === platform);

    return currentPlatform?.icon || null;
  };

  const genColorIcon = platform => {
    const currentPlatform = platforms.find(item => item.key === platform);

    return currentPlatform?.color || null;
  };

  const handleUpdateTypeConnect = (type, platform) => () => {
    props.handleAction({ id: props.store.id, type, platform });
  };

  const handleConnectStore = e => {
    if (e.stopPropagation) {
      e.stopPropagation();
    }

    if (props?.store?.platform === 'shopee') {
      request('/sales-channels-service/shopee/get-auth-url', {})
        .then(result => {
          if (result.is_success) {
            redirectToConnectPlatform(props?.store?.platform, result.data.url);
            props.setUrlIframe(result.data.url);
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
        });
    } else if (props?.store?.platform === 'tiktok') {
      dispatch(actions.setLoading(true));
      request('/sales-channels-service/tiktok/get-auth-url', {})
        .then(result => {
          dispatch(actions.setLoading(false));
          if (result.is_success) {
            redirectToConnectPlatform(props?.store?.platform, result.data.url);
            props.setUrlIframe(result.data.url);
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
      redirectToConnectPlatform(props?.store?.platform, lazadaUrl);
      props.setUrlIframe(lazadaUrl);
    }
  };

  const goDetail = () => {
    window.location.href = `/stores/detail/${props?.store?.id}?page=1&page_size=20`;
  };

  function ActionMenu() {
    const ComponentConnect = (
      <Item.Action.MenuItem
        key="0"
        onClick={handleConnectStore}
        className="text-blue1"
      >
        <i className="far fa-link" />
        Kết nối lại cửa hàng
      </Item.Action.MenuItem>
    );
    return (
      <Item.Action.Menu>
        {props.store.status === 'pending_for_disconnect' ||
        props.store.status === 'pending_for_delete' ? (
          ComponentConnect
        ) : (
          <>
            <Item.Action.MenuItem key="0" onClick={goDetail}>
              <i className="far fa-home" />
              Xem chi tiết cửa hàng
            </Item.Action.MenuItem>
            {props.store.auth_status === 'token_expired' ||
            props.store.status === 'inactive' ? (
              ComponentConnect
            ) : (
              <Item.Action.MenuItem
                key="1"
                onClick={handleUpdateTypeConnect(
                  'disconnect',
                  props.store.platform,
                )}
              >
                <i className="far fa-link" />
                Ngắt kết nối cửa hàng
              </Item.Action.MenuItem>
            )}
            <Item.Action.MenuItem
              key="2"
              onClick={handleUpdateTypeConnect('delete', props.store.platform)}
            >
              <i className="far fa-trash-alt" />
              Xóa cửa hàng
            </Item.Action.MenuItem>
          </>
        )}
        {/* {props.store.status === 'pending_for_delete' || (
          <Item.Action.MenuItem
            key="1"
            onClick={handleUpdateTypeConnect('delete')}
          >
            <i className="far fa-trash-alt" />
            Xóa cửa hàng
          </Item.Action.MenuItem>
        )} */}
      </Item.Action.Menu>
    );
  }

  const currentStatus = STATUS.find(v => v.id === props.store.status);
  return (
    <Item.Wrapper>
      <Item.Event onClick={goDetail}>
        <Item.Thumb>
          {props.store.logo ? (
            <Image src={props.store.logo} alt="" />
          ) : (
            <i className="far fa-store" />
          )}
        </Item.Thumb>
        <Item.Info.Wrapper>
          <Item.Info.Wrapper>
            <Item.Info.Title>{props?.store.name}</Item.Info.Title>
            <Item.Info.Email>{props?.store.platform_email}</Item.Info.Email>
          </Item.Info.Wrapper>
          <Item.Info.Email>
            Kho: {props?.store.pickup_warehouse?.warehouse_name} -{' '}
            {[
              props?.store.pickup_warehouse?.detail_address,
              props?.store.pickup_warehouse?.ward_name,
              props?.store.pickup_warehouse?.distinct_name,
              props?.store.pickup_warehouse?.province_name,
            ]
              .filter(address => address)
              .join(', ')}
          </Item.Info.Email>
        </Item.Info.Wrapper>

        {/* {props.store.status === 'active' ? (
          <Item.Status active>Đang kết nối</Item.Status>
        ) : (
          <Item.Status>Ngắt kết nối</Item.Status>
        )} */}
        {props.store.auth_status === 'token_expired' ? (
          <>
            <Button
              className="btn-sm"
              context="secondary"
              onClick={handleConnectStore}
            >
              Cấp lại
            </Button>
            <BoxColor notBackground width="130px" colorValue="orange">
              Hết hạn truy cập
            </BoxColor>
          </>
        ) : (
          <BoxColor
            notBackground
            width="130px"
            colorValue={currentStatus?.color}
          >
            {currentStatus?.name || ''}
          </BoxColor>
        )}
        <Item.Platform>
          <span style={{ color: genColorIcon(props.store.platform) }}>
            <img src={genPlatformIcon(props.store.platform)} alt="" />
            {props.store.platform}
          </span>
        </Item.Platform>

        <Item.Detail.Wrapper>
          <Item.Detail.Item.Wrapper>
            <Item.Detail.Item.Title>Tổng sản phẩm</Item.Detail.Item.Title>
            <Item.Detail.Item.Number>
              {props.store.number_of_product}
            </Item.Detail.Item.Number>
          </Item.Detail.Item.Wrapper>

          <Item.Detail.Item.Wrapper>
            <Item.Detail.Item.Title>Sản phẩm từ Odii</Item.Detail.Item.Title>
            <Item.Detail.Item.Number>
              {props.store.number_of_product -
                props.store.number_of_product_platform}
            </Item.Detail.Item.Number>
          </Item.Detail.Item.Wrapper>

          <Item.Detail.Item.Wrapper>
            <Item.Detail.Item.Title>Đơn hàng</Item.Detail.Item.Title>
            <Item.Detail.Item.Number>
              {props.store.number_of_order}
            </Item.Detail.Item.Number>
          </Item.Detail.Item.Wrapper>
        </Item.Detail.Wrapper>
      </Item.Event>

      <Item.Action.Wrapper>
        <Item.Action.Dropdown placement="bottomRight" overlay={ActionMenu}>
          <i className="far fa-ellipsis-v" />
        </Item.Action.Dropdown>
      </Item.Action.Wrapper>
    </Item.Wrapper>
  );
}
