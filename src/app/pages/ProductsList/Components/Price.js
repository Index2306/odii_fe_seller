import React from 'react';
import { formatMoney } from 'utils/helpers';
import styled from 'styled-components/macro';
import { bgWarehousing } from 'assets/images';
import { money } from 'assets/images/icons';
import { Row, Col, Form as F } from 'antd';
import { CustomStyle } from 'styles/commons';
import { InputMoney } from 'app/components/DataEntry/InputNumber';
import { CustomSectionWrapper } from './styled';

const Item = F.Item;

function Price({ layout, defaultVariation = {}, detail = {} }) {
  return (
    <div>
      <CustomStyle my={{ xs: 's4' }}>
        {/* <div className="title">Giá tiền</div> */}
        <Row>
          <Col xs={24} md={17}>
            <CustomSectionWrapper
              borderTopRightRadius={0}
              borderBottomRightRadius={0}
              className="h-100"
              borderRight="1px solid"
              borderColor="stroke"
            >
              <Row gutter={24}>
                <Col span={24}>
                  <Item
                    name={['defaultVariation', 'origin_supplier_price']}
                    label="Giá nhà cung cấp"
                    {...layout}
                    rules={[
                      {
                        required: true,
                        message: 'Please input your origin_supplier_price!',
                      },
                    ]}
                  >
                    <InputMoney disabled size="large" placeholder="Giá bán" />
                  </Item>
                </Col>
                {/* <Col span={12}>
              <Item
                name="currency_code"
                label="Đơn vị tiền tệ"
                {...layout}
                rules={[
                  {
                    required: true,
                    message: 'Please input your currency_code!',
                  },
                ]}
              >
                <Select
                // defaultValue={text}
                // value={newStatus?.id === detail?.id ? newStatus?.name : text}
                // onSelect={handleShowConfirm(record)}
                // filterOption={(input, option) =>
                //   option.props.children
                //     .toLowerCase()
                //     .indexOf(input.toLowerCase()) >= 0
                // }
                >
                  {constants?.CURRENCY_LIST?.map(v => (
                    <Select.Option key={v.id} value={v.id}>
                      {v.name}
                    </Select.Option>
                  ))}
                </Select>
              </Item>
            </Col> */}
              </Row>

              <Row gutter={24}>
                <Col span={24}>
                  <Item
                    name={['defaultVariation', 'retail_price']}
                    label="Giá bán"
                    {...layout}
                    rules={[
                      {
                        type: 'number',
                        min: detail?.low_retail_price,
                        message: `Giá bán tối thiểu: ${formatMoney(
                          detail?.low_retail_price,
                        )}`,
                      },
                    ]}
                  >
                    <InputMoney size="large" placeholder="Giá bán" />
                  </Item>
                </Col>
                {/* <Col span={12}>
                  <Item
                    name={['defaultVariation', 'retail_price_compare_at']}
                    label="Giá bán gốc"
                    {...layout}
                    rules={[
                      {
                        required: true,
                        message: 'Please input your retail_price_compare_at!',
                      },
                    ]}
                  >
                    <InputMoney size="large" placeholder="Giá bán gốc" />
                  </Item>
                </Col> */}
              </Row>
              {/* <div className="title">Hiển thị khuyến mại</div> */}
              {/* <div className="">
          <Item
            name="showDiscount"
            label=""
            {...layout}
            // rules={[
            //   {
            //     required: true,
            //     message: 'Please input your showDiscount!',
            //   },
            // ]}
          >
            <Radio.Group onChange={onChange}>
              <Space direction="vertical">
                <Radio value={1}>Tự động: (14%)</Radio>
                <Radio value={2}>Tự set</Radio>
              </Space>
            </Radio.Group>
          </Item>
        </div> */}
            </CustomSectionWrapper>
          </Col>
          <Col xs={24} md={7}>
            <IncludeImage
              className="h-100 d-flex flex-column align-items-center justify-content-center"
              borderTopLeftRadius={0}
              borderBottomLeftRadius={0}
              mb={{ md: 0 }}
              borderLeft="none"
              textAlign="center"
            >
              <img src={money} alt="" />
              <CustomStyle
                mb={{ xs: 's4' }}
                color="primary"
                fontWeight="medium"
              >
                Lợi nhuận
              </CustomStyle>
              <CustomStyle color="greenMedium" mb={{ xs: 's4' }}>
                {defaultVariation.retail_price
                  ? formatMoney(
                      +defaultVariation.retail_price -
                        (defaultVariation.odii_price ??
                          defaultVariation.origin_supplier_price),
                    )
                  : 0}{' '}
                đ
              </CustomStyle>
              {/* <Button
                className="btn-sm"
                context="secondary"
                width="100%"
                onClick={goDetail(item.id)}
              >
                Xem chi tiết
              </Button> */}
            </IncludeImage>
          </Col>
        </Row>
      </CustomStyle>
    </div>
  );
}

export const IncludeImage = styled(CustomSectionWrapper)`
  background-image: url(${bgWarehousing});
  background-size: cover;
  background-color: transparent;
  img {
    margin-bottom: 12px;
    /* width: 80px;
    height: 80px; */
  }
`;

export default Price;
