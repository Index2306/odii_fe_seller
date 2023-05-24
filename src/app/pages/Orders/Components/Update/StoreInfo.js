import React from 'react';
import { StoreInfoWrapper } from '../../styles/OrderDetail';
import { isEmpty } from 'lodash';

import { Image } from 'app/components';

import {
  ShopifyIcon,
  ShopeeIcon,
  LazadaIcon,
  WooCommerceIcon,
  TiktokIcon,
} from 'assets/images/platform';

const platforms = [
  { key: 'shopify', name: 'Shopify', icon: ShopifyIcon, isActive: false },
  {
    key: 'woocommerce',
    name: 'Woocommerce',
    icon: WooCommerceIcon,
    isActive: false,
  },
  { key: 'shopee', name: 'Shopee', icon: ShopeeIcon, isActive: false },
  { key: 'lazada', name: 'Lazada', icon: LazadaIcon, isActive: true },
  { key: 'tiktok', name: 'Tiktok', icon: TiktokIcon, isActive: false },
];

export default function StoreInfo({ order }) {
  const isLoading = isEmpty(order);

  const currPlatform =
    order?.store &&
    platforms.find(platform => platform.key === order?.store?.platform);

  return (
    !isLoading && (
      <StoreInfoWrapper className="box-df">
        <div className="store-info__top">
          <div>
            <span className="section-title">Kênh bán hàng</span>
          </div>
          <div className="store-platform">
            {currPlatform && (
              <img
                alt={currPlatform?.name}
                src={currPlatform?.icon}
                className="store-platform__icon"
              />
            )}
            <span className="store-platform__name">{currPlatform?.name}</span>
          </div>
        </div>
        <div className="store-info_content">
          {order?.store?.id ? (
            <>
              <Image
                alt=""
                src={order?.store?.logo}
                height="20px"
                width="20px"
                className="store-icon"
              />

              <span className="store-name">{order?.store?.name}</span>
            </>
          ) : (
            <span className="value-empty">Cửa hàng khác</span>
          )}
        </div>
      </StoreInfoWrapper>
    )
  );
}
