import React, { memo } from 'react';
import styled from 'styled-components';
import { Avatar, Image, A } from 'app/components';
import { CustomStyle } from 'styles/commons';
import { arrowRight } from 'assets/images/icons';

import { CustomSectionWrapper } from './styled';

export default memo(function StoreDetail({ data, shop_product_id }) {
  const { platform, platform_shop_id, status, logo, name } = data || {};
  const isActive = status === 'active';

  return (
    <CustomSectionWrapper mt={{ xs: 's4' }}>
      <div className="title">Cửa hàng đang bán</div>
      <CustomStyle
        p={{ xs: 's4' }}
        mb={{ xs: 's3' }}
        className="d-flex align-items-center"
        border="1px solid"
        borderColor="stroke"
        borderRadius="4px"
      >
        <CustomAvatar
          shape="square"
          size={24}
          src={<Image src={logo?.location} size="40x40" />}
        />
        <CustomStyle ml={{ xs: 's2' }}>{name}</CustomStyle>
      </CustomStyle>

      <CustomStyle mb={{ xs: 's5' }} fontWeight="medium">
        {platform !== 'tiktok' && (
          <A
            target="_blank"
            href={
              platform === 'shopee'
                ? `https://shopee.vn/product/${platform_shop_id}/${shop_product_id}`
                : `https://www.lazada.vn/products/odii-product-i${shop_product_id}.html`
            }
          >
            Xem sản phẩm trên cửa hàng <img src={arrowRight} alt="" />
          </A>
        )}
      </CustomStyle>

      <div className="title">Trạng thái kết nối</div>
      <CustomStyle
        mb={{ xs: 's5' }}
        p={{ xs: 's4' }}
        className="d-flex align-items-center"
        border="1px solid"
        borderColor="stroke"
        borderRadius="4px"
      >
        <CustomStyle
          ml={{ xs: 's2' }}
          color={isActive ? 'greenMedium' : 'secondary2'}
        >
          {isActive ? 'Hoạt động' : 'Tạm dừng'}
        </CustomStyle>
      </CustomStyle>
    </CustomSectionWrapper>
  );
});

const CustomAvatar = styled(Avatar)`
  .ant-image-img {
    border-radius: 50%;
  }
`;
