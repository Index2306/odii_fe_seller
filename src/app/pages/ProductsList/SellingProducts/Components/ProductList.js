import React from 'react';
import { ProductList as List, ProductItem as Item } from '../styles';
import { formatMoney } from 'utils/helpers';
import { useHistory } from 'react-router-dom';
import DefaultIMG from 'assets/images/product-thumb-default.svg';
import { CustomStyle } from 'styles/commons';
import { Tooltip } from 'antd';
import constants from 'assets/constants';
import { useSellingProductsSlice } from '../../SellingProducts/slice';
import { useDispatch } from 'react-redux';
import { BoxColor, Image } from 'app/components';
import { CaretUpOutlined } from '@ant-design/icons';
import { uniq, max, min } from 'lodash';

export default function ProductList(props) {
  const { products } = props;
  const dispatch = useDispatch();
  const { actions } = useSellingProductsSlice();
  const history = useHistory();
  const handleClickName = id => () => {
    dispatch(actions.setListSelling([id]));
    history.push(`/selling-products/update/${id}`);
  };

  const getSupplierPriceText = product => {
    let list = uniq(
      product.product_variation.map(item => item.origin_supplier_price),
    );
    if (!product.has_variation) return formatMoney(list[0]);

    if (product.has_variation && list.length > 1)
      return `${formatMoney(min(list))} - ${formatMoney(max(list))}`;

    if (product.has_variation && list.length <= 1) return formatMoney(list[0]);

    return '';
  };
  const getSupplierRecommendPrice = product => {
    let list = uniq(product.product_variation.map(item => item.retail_price));
    let price = '';
    if (!product.has_variation) price = formatMoney(list[0]);
    else if (product.has_variation) {
      if (list.length <= 1) {
        price = formatMoney(list[0]);
      } else {
        price = `${formatMoney(min(list))} -
          ${formatMoney(max(list))}`;
      }
    }
    if (price !== '' && price) {
      return <div className="price-suggest">{price}</div>;
    }
    return '';
  };

  return (
    <List>
      {products.map(product => {
        const currentStatus = constants.PUBLISH_STATUS.find(
          v => v.id === `${product.status}/${product.publish_status}`,
        );

        return (
          <Item onClick={handleClickName(product.id)}>
            <div className="thumb">
              <Image src={product?.thumb?.location || DefaultIMG} />
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
                <div className="name">
                  <Tooltip
                    mouseEnterDelay={0.25}
                    placement="bottomLeft"
                    title={product.name}
                  >
                    {product.name}
                  </Tooltip>
                </div>

                <div className="more">
                  <div className="variant">
                    {/* <div className="variant-title">Danh mục: </div> */}
                    <div className="variant-title">
                      <CustomStyle fontSize="12px">
                        {product.top_category.name}
                      </CustomStyle>
                    </div>
                  </div>
                </div>

                <div className="price">
                  <Tooltip title="Giá của nhà cung cấp">
                    <div className="price-left">
                      <div className="text-item">Giá NCC :</div>
                      <div className="price-item">
                        {getSupplierPriceText(product)}
                      </div>
                    </div>
                  </Tooltip>
                  <div className="price-right">
                    <div className="text-item">Giá bán :</div>
                    <div className="price-item">
                      {getSupplierRecommendPrice(product)}
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="more">
                  <div className="variant">
                    <div className="variant-title">Biến thế</div>
                    <div className="variant-info">
                      <CustomStyle fontSize="f2">
                        {product.number_of_variation}
                      </CustomStyle>
                    </div>
                  </div>

                  <div className="quantity">
                    <div className="quantity-title">Tồn kho</div>

                    <CustomStyle fontSize="f2">
                      {!(
                        product.supplier_product_publish_status === 'inactive'
                      ) ? (
                        <CustomStyle textAlign="right">
                          {product.supplier_product_total_quantity}
                        </CustomStyle>
                      ) : (
                        <CustomStyle textAlign="right" color="secondary2">
                          Hết hàng
                        </CustomStyle>
                      )}
                    </CustomStyle>
                  </div>
                </div>
              </div>
            </div>
          </Item>
        );
      })}
    </List>
  );
}
