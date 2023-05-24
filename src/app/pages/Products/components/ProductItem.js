import React from 'react';
import { ProductItem as Item } from '../styles/Main';
import { formatMoney, genImgUrl } from 'utils/helpers';
import { times, minBy, maxBy, isEmpty } from 'lodash';
import { useHistory } from 'react-router-dom';
import { Button } from 'app/components';
import DefaultIMG from 'assets/images/product-thumb-default.svg';
import VietnamFlag from 'assets/images/flag/vietnam.svg';
import request from 'utils/request';
import { CustomStyle } from 'styles/commons';
import { message, Tooltip } from 'antd';
import { CaretUpOutlined } from '@ant-design/icons';

export default function ProductItem(props) {
  const { product } = props;
  const [isLoading, setIsLoading] = React.useState(false);
  const history = useHistory();
  const openDetailModal = () => {
    history.push(
      `${history.location.pathname}/${product.id}${history.location.search}`,
    );
    // dispatch(actions.getProductDetail(product.id));
  };

  const handleImportProduct = async () => {
    setIsLoading(true);

    try {
      const response = await request(
        'product-service/seller/store-product/add-product',
        {
          method: 'post',
          data: { product_id: product.id },
        },
      );
      if (response.is_success) {
        message.success('Đã thêm sản phẩm thành công');
      } else {
        message.error('Đã có lỗi xảy ra. Vui lòng thử lại');
      }
      setIsLoading(false);
    } catch (e) {
      await message.error('Đã có lỗi xảy ra. Vui lòng thử lại');
    }
  };

  const getSupplierPriceText = isValue => {
    const priceArr = [];
    let finalPrice;
    if (!product.has_variation) priceArr.push(product.origin_supplier_price);
    else {
      priceArr.push(product.min_price_variation);
      priceArr.push(product.max_price_variation);
    }
    if (isValue) {
      if (product?.is_promotion) {
        finalPrice = product?.promotions[0]?.final_price;
      } else {
        finalPrice = minBy(priceArr);
      }
    } else {
      finalPrice = product?.promotions[0]?.origin_supplier_price;
    }

    return formatMoney(finalPrice);
  };

  const getSupplierPromotionValue = () => {
    let value;
    if (product?.is_promotion) {
      if (
        product?.promotions[0]?.option === 'percent' ||
        product?.promotions[0]?.type === 'quantity_by'
      ) {
        value = product?.promotions[0]?.value;
        return (
          <div className="promotion-sale">
            OFF <span>{value}%</span>
          </div>
        );
      } else {
        return <div className="promotion-sale">OFF</div>;
      }
    }
    return;
  };

  const getSupplierRecommendPrice = () => {
    let price = '';
    let upPercent = 0;
    let finalPrice;

    const priceArr = [];
    const recommendArr = [];
    if (!product.has_variation) {
      priceArr.push(product.origin_supplier_price);
      recommendArr.push(product.recommend_retail_price);
    } else {
      priceArr.push(product.min_price_variation);
      priceArr.push(product.max_price_variation);
      recommendArr.push(product.min_recommend_variation_price);
      recommendArr.push(product.max_recommend_variation_price);
    }
    if (!isEmpty(product?.promotions)) {
      finalPrice = product?.promotions[0]?.final_price;
    } else {
      finalPrice = minBy(priceArr);
    }

    const finalRecommend = minBy(recommendArr);
    if (!finalPrice || !finalRecommend) return '';

    upPercent = (((finalRecommend - finalPrice) * 100) / finalPrice).toFixed(0);
    price = formatMoney(finalRecommend);

    if (price !== '' && price) {
      return (
        <div className="price-suggest">
          {price}
          <div className="percent">
            {upPercent}
            %
            <CaretUpOutlined style={{ color: 'lightgreen' }} />
          </div>
        </div>
      );
    }
    return '';
  };
  return (
    <Item>
      <div className="thumb" onClick={openDetailModal}>
        {getSupplierPromotionValue()}
        <img
          src={
            product.thumb?.location
              ? genImgUrl({
                  width: 300,
                  height: 300,
                  location: product.thumb?.location,
                })
              : DefaultIMG
          }
          alt={product.name}
        />
      </div>

      <div className="info">
        <div className="name" onClick={openDetailModal}>
          <Tooltip
            mouseEnterDelay={0.25}
            placement="bottomLeft"
            title={product.name}
          >
            {product.name}
          </Tooltip>
        </div>

        <div className="supplier">
          <CustomStyle color="gray3" mr={{ xs: 's2' }}>
            Bán bởi
          </CustomStyle>
          <a href={`/supplier/detail/${product.supplier.id}`}>
            {product.supplier.name}
          </a>
          <CustomStyle ml={{ xs: 's2' }}>
            <img src={VietnamFlag} alt="" />
          </CustomStyle>
        </div>

        <div className="price">
          <div className="price-left">
            <div className="text-item">Giá NCC</div>
            <div className="price-item">{getSupplierPriceText(true)}</div>
            {product?.is_promotion && (
              <div
                className="price-item"
                style={{
                  textDecoration: 'line-through',
                  color: 'gray',
                  fontSize: '11px',
                }}
              >
                {product?.is_promotion && getSupplierPriceText()}
              </div>
            )}
          </div>
          <div className="price-right">
            <div className="text-item text-right">Gợi ý</div>
            <div className="price-item text-right">
              {getSupplierRecommendPrice()}
            </div>
          </div>
        </div>
        {/* TODO: Ẩn tạm lượt đánh giá do ban đầu chưa có người dùng đánh giá */}
        {/* <div className="rating">
          {product.number_of_vote ? (
            <>
              <Rating rating={product.rating} />
              <span className="vote-count">({product.number_of_vote})</span>
            </>
          ) : (
            <>
              <i className="far fa-star-half-alt" />
              <span>Chưa có lượt đánh giá</span>
            </>
          )}
        </div> */}

        <div className="more">
          <div className="warehouse">
            <div className="warehouse-title">Kho hàng</div>
            <div className="warehouse-info">
              {/* <img src={VietnamFlag} alt="" /> */}
              <span>
                {product?.supplier_warehousing?.name.replace('Kho', '')}
                {/* {product.from_location.country_code} */}
              </span>
            </div>
          </div>

          <div className="selected">
            <div className="selected-title">Lượt được chọn</div>

            <div className="selected-count">
              {product.number_of_times_pushed || 0}
            </div>
          </div>
        </div>

        <div className="action">
          <Button
            className="btn-sm"
            // icon={!isLoading ? 'fas fa-plus' : 'far fa-spinner-third fa-spin'}
            onClick={handleImportProduct}
            disabled={isLoading}
          >
            {isLoading ? '' : 'THÊM SẢN PHẨM'}
          </Button>
        </div>
      </div>
    </Item>
  );
}

const Rating = ({ rating }) => {
  const $starActive = <i className="fas fa-star active" />;
  const $starInactive = <i className="fas fa-star" />;

  let $html = [];

  if (!rating) {
    times(5, () => $html.push($starInactive));
  } else {
    times(rating, () => $html.push($starActive));
    times(5 - rating, () => $html.push($starInactive));
  }

  return $html;
};
