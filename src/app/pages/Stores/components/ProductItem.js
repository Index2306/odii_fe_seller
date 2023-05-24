import React from 'react';
import { ProductItem as Item } from '../styles';
import { formatMoney, genImgUrl } from 'utils/helpers';
import { times } from 'lodash';
import { useHistory } from 'react-router-dom';
import { Button, Image } from 'app/components';
import DefaultIMG from 'assets/images/product-thumb-default.svg';
import VietnamFlag from 'assets/images/flag/vietnam.svg';
import request from 'utils/request';
import { CustomStyle } from 'styles/commons';
import { message, Tooltip } from 'antd';
import constants from 'assets/constants';
import { BoxColor } from 'app/components';

export default function ProductItem(props) {
  const { product } = props;
  const [isLoading, setIsLoading] = React.useState(false);
  const history = useHistory();
  const openDetailModal = () => {
    // history.push(
    //   `${history.location.pathname}/${product.id}${history.location.search}`,
    // );
    // dispatch(actions.getProductDetail(product.id));
  };
  const currentStatus = constants.COMMON_STATUS.find(
    v => v.id === `${product.status}`,
  );

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
  // https://i.odii.xyz/300x300/f9933a92b128447c9934e52bb27b5650-61df3c46e1f837f743f3bd1c0aab457e.jpg
  return (
    <Item>
      <div className="thumb" onClick={openDetailModal}>
        <img
          // src={product.store.logo || DefaultIMG}
          src={product.thumb_url || DefaultIMG}
          alt={product.name}
        />
      </div>

      <div className="info flex-col">
        <div>
          <BoxColor
            colorValue={currentStatus?.color}
            notBackground={true}
            className="box-custom"
          >
            {currentStatus?.name}
          </BoxColor>
          <div className="name" onClick={openDetailModal}>
            <Tooltip
              mouseEnterDelay={0.25}
              placement="bottomLeft"
              title={product.name}
            >
              {product.name}
            </Tooltip>
          </div>

          <div className="price">{formatMoney(product.price)}</div>
        </div>

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
        <div>
          <div className="more">
            <div className="variant">
              <div className="variant-title">Biến thể</div>
              <div className="variant-info">
                <CustomStyle fontWeight="bold" fontSize="f2">
                  {product.number_of_variation}
                </CustomStyle>
              </div>
            </div>

            <div className="quantity">
              <div className="quantity-title">Tồn kho</div>

              <CustomStyle fontWeight="bold" fontSize="f2">
                {product.total_quantity}
              </CustomStyle>
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
