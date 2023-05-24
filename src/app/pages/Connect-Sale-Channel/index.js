import React from 'react';
import * as ConnectStore from './styles';
import { Lazada, Shopee, Tiktok } from './Features';

export function ConnectSaleChannel({ match }) {
  const platform = match.params?.platform;

  return (
    <ConnectStore.Wrapper>{renderComponent(platform)}</ConnectStore.Wrapper>
  );
}

const renderComponent = platform => {
  switch (platform) {
    case 'lazada':
      return <Lazada />;
    case 'shopee':
      return <Shopee />;
    case 'tiktok':
      return <Tiktok />;
    default:
      return null;
  }
};
