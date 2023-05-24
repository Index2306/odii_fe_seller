import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Row, Col, Divider, List } from 'antd';
import { isEqual, isNumber } from 'lodash';
import { InputMoney } from 'app/components/DataEntry/InputNumber';
import { Modal, Button, Image } from 'app/components';
import { CustomStyle } from 'styles/commons';

export default function EditPrice({
  layout,
  data = [],
  variations = [],
  setVariations,
  callBackCancel,
  ...res
}) {
  const [allPrice1, setAllPrice1] = useState('');
  const [allPrice2, setAllPrice2] = useState('');
  const [listShow, setListShow] = useState(data);
  const [finalListVariation, setFinalListVariation] = useState(variations);
  const [disableOk, setDisableOk] = useState(true);

  const onSave = () => {
    setVariations(finalListVariation);
    callBackCancel();
  };

  useEffect(() => {
    if (isEqual(data, listShow)) {
      setDisableOk(true);
    } else setDisableOk(false);
  }, [listShow]);

  const handleChangeOdiiPrice = price => {
    if (isNumber(price)) {
      setAllPrice1(price);
    } else {
      setAllPrice1('');
    }
  };

  const handleChangeAllPrice2 = price => {
    if (isNumber(price)) {
      setAllPrice2(price);
    } else {
      setAllPrice2(price);
    }
  };

  const applyAllPrice = type => () => {
    const price = type === 'retail_price' ? allPrice1 : allPrice2;
    const handleVariations = finalListVariation.map(item => ({
      ...item,
      [type]: listShow.some(o => o.id === item.id) ? price : item[type],
    }));
    const handleListShow = listShow.map(item => ({
      ...item,
      [type]: price,
    }));
    setFinalListVariation(handleVariations);
    setListShow(handleListShow);
  };

  const applyPrice = (type, id) => price => {
    if (isNumber(price)) {
      const handleVariations = finalListVariation.map(item => ({
        ...item,
        [type]: item.id === id ? price : item[type],
      }));
      const handleListShow = listShow.map(item => ({
        ...item,
        [type]: item.id === id ? price : item[type],
      }));
      setFinalListVariation(handleVariations);
      setListShow(handleListShow);
    }
  };

  return (
    <div>
      <Modal
        {...res}
        disableOk={disableOk}
        width={600}
        callBackOk={onSave}
        callBackCancel={callBackCancel}
      >
        <Row gutter={16}>
          <Col span={16}>
            <CustomStyle my={{ xs: 's3' }} fontWeight="medium">
              Áp dụng tất cả giá bán
            </CustomStyle>
            <Row gutter={8}>
              <Col span={16}>
                <InputMoney
                  placeholder="Giá"
                  value={allPrice1}
                  onChange={handleChangeOdiiPrice}
                />
              </Col>
              <Col span={8}>
                <Button
                  context="secondary"
                  disabled={!isNumber(allPrice1)}
                  className="w-100 h-100 p-0"
                  onClick={applyAllPrice('retail_price')}
                >
                  Áp dụng
                </Button>
              </Col>
            </Row>
          </Col>
          {/* <Col span={12}>
            <CustomStyle my={{ xs: 's3' }} fontWeight="medium">
              Áp dụng tất cả giá bán gốc
            </CustomStyle>
            <Row gutter={8}>
              <Col span={16}>
                <InputMoney
                  placeholder="Giá"
                  value={allPrice2}
                  onChange={handleChangeAllPrice2}
                />
              </Col>
              <Col span={8}>
                <Button
                  context="secondary"
                  disabled={!isNumber(allPrice2)}
                  className="w-100 h-100 p-0"
                  onClick={applyAllPrice('retail_price_compare_at')}
                >
                  Áp dụng
                </Button>
              </Col>
            </Row>
          </Col> */}
        </Row>

        <Divider />

        <WrapperOption>
          {listShow.map(item => (
            <Row gutter={8}>
              <Col span={10}>
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Image size="200x200" src={item?.thumb?.location} />
                    }
                    title={`${item.option_1}${
                      item.option_2 ? `/${item.option_2}` : ''
                    }${item.option_3 ? `/${item.option_3}` : ''}`}
                  />
                </List.Item>
              </Col>
              <Col span={10}>
                <CustomStyle my={{ xs: 's3' }}>Giá</CustomStyle>
                <InputMoney
                  placeholder="Giá"
                  value={item.retail_price}
                  onChange={applyPrice('retail_price', item.id)}
                />
              </Col>
              {/* <Col span={7}>
                <CustomStyle my={{ xs: 's3' }}>Giá khuyến mại</CustomStyle>
                <InputMoney
                  placeholder="Giá"
                  value={item.retail_price_compare_at}
                  onChange={applyPrice('retail_price_compare_at', item.id)}
                />
              </Col> */}
            </Row>
          ))}
        </WrapperOption>
      </Modal>
    </div>
  );
}

const WrapperOption = styled.div`
  max-height: 300px;
  overflow: scroll;
  > :not(:last-child) {
    padding-bottom: 16px;
    margin-bottom: 12px;
    border-bottom: 1px solid ${({ theme }) => theme.stroke};
  }
  .ant-image {
    width: 48px;
    border-radius: 4px;
  }
  .ant-list-item-meta-title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .ant-list-item-meta-description {
    font-weight: 400;
    font-size: 12;
    color: rgba(0, 0, 0, 0.4);
  }
`;
