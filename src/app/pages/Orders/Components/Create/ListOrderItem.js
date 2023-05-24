import React, { useState, useEffect, useCallback, memo } from 'react';
import { ListOrderItemWrapper } from '../../styles/OrderDetail';
import { isEmpty, debounce } from 'lodash';
import { Button, EmptyPage, Form, Image } from 'app/components';
import { formatMoney, genImgUrl } from 'utils/helpers';
import { Input, Space } from 'antd';

export const KEY_WORD_MIN_LENGTH = 2;

export default memo(function ListOrderItem({
  onSearch,
  selectedVariations,
  setSelectedVariations,
  keywordFilter,
  setKeywordFilter,
  setShippingFee,
}) {
  const [form] = Form.useForm();

  const updateKeywordFiler = () => {
    form.setFieldsValue({ keywordFilter });
  };

  const changeFilter = useCallback(
    debounce(keyword => {
      setKeywordFilter(keyword);
    }, 200),
    [],
  );

  const updateQuantity = useCallback(
    debounce((variation, value) => {
      value = parseInt(value);
      if (!value || value < 1) {
        value = 1;
      }
      // if (value > variation.total_quantity) {
      //   value = variation.total_quantity;
      // }
      const selectedVariationClones = [...selectedVariations];
      const currVariationIndex = selectedVariationClones.findIndex(
        selectedVariation =>
          selectedVariation.productId === variation.productId &&
          selectedVariation.id === variation.id,
      );
      selectedVariationClones[currVariationIndex] = {
        ...selectedVariationClones[currVariationIndex],
        quantity: value,
      };
      setSelectedVariations(selectedVariationClones);
      setShippingFee(0);
    }, 100),
    [selectedVariations],
  );

  const removeVariation = variation => {
    setSelectedVariations(
      selectedVariations.filter(
        selectedVariation =>
          selectedVariation.productId !== variation.productId ||
          selectedVariation.id !== variation.id,
      ),
    );
    setShippingFee(0);
  };

  useEffect(() => {
    updateKeywordFiler();
  }, [keywordFilter]);

  return (
    <ListOrderItemWrapper className="box-df">
      <Form name="product-filter" form={form}>
        <div className="list-order-wrapper">
          <div className="list-order__top flex-row">
            <div className="list-order__title section-title">
              <span>Sản phẩm</span>
            </div>
          </div>
          <div className="d-flex product-search-wrapper">
            <div className="product-search base-border">
              <Form.Item
                name="keywordFilter"
                rules={[
                  {
                    min: KEY_WORD_MIN_LENGTH,
                    message: `Nội dung tìm kiếm ít nhất ${KEY_WORD_MIN_LENGTH} kí tự`,
                  },
                ]}
              >
                <Input
                  className="product-search__input br-df border-df"
                  placeholder="Tìm và thêm sản phẩm hiện có"
                  onChange={e => {
                    changeFilter(e.target.value);
                  }}
                  onClick={onSearch}
                ></Input>
              </Form.Item>
            </div>
            <Button
              className="btn-sm p-0 btn-search"
              width="135px"
              onClick={onSearch}
            >
              Tìm sản phẩm
            </Button>
          </div>
          {!selectedVariations?.length ? (
            <div className="empty-page-wrapper">
              <EmptyPage type="list-order-empty"></EmptyPage>
            </div>
          ) : (
            <div
              className="content-items"
              style={{ minHeight: '245.733px', marginTop: '-32px' }}
            >
              <table className="order-item-tbl create-tbl">
                <thead>
                  <tr>
                    <td>Sản phẩm</td>
                    <td>Giá NCC</td>
                    <td>Giá bán</td>
                    <td>Số lượng</td>
                    <td>Thành tiền</td>
                    <td></td>
                  </tr>
                </thead>
                <tbody>
                  {selectedVariations.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td>
                          <div>
                            <Image
                              className="order-thumbnail order-create-thumbnail"
                              src={genImgUrl({
                                location: item?.thumb?.location,
                                width: 40,
                                height: 40,
                              })}
                            />
                            <div className="order-info-text">
                              <span>{item.productName}</span>
                              <span>
                                {item.sku ? `SKU: ${item.sku}` : 'Không có SKU'}
                              </span>
                              <span>
                                {item.metadata?.shop_variation_name ||
                                  item.name}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>{formatMoney(item.origin_supplier_price)}</td>
                        <td>{formatMoney(item.price)}</td>
                        <td>
                          <input
                            type="number"
                            value={item.quantity}
                            className="quantity-input"
                            onChange={e => {
                              updateQuantity(item, e.target.value);
                            }}
                          ></input>
                        </td>
                        <td>{formatMoney(item.price * item.quantity)}</td>
                        <td>
                          <i
                            className="order-item-remove fa fa-times"
                            onClick={() => removeVariation(item)}
                          ></i>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Form>
    </ListOrderItemWrapper>
  );
});
