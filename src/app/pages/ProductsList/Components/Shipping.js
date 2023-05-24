import React from 'react';
import { Row, Col, Form as F } from 'antd';
import { Input } from 'app/components';
// import { CustomStyle } from 'styles/commons';
import { CustomSectionWrapper } from './styled';

const Item = F.Item;

function Shipping({ layout, defaultVariation }) {
  return (
    <div>
      <CustomSectionWrapper mt={{ xs: 's4' }}>
        <div className="title">Thông tin giao hàng</div>
        <div className="">
          <Row gutter={24}>
            <Col xs={24} lg={6}>
              <Item
                name={['defaultVariation', 'box_length_cm']}
                label="Dài"
                {...layout}
                // rules={[
                //   {
                //     required: true,
                //     message: 'Please input your sku!',
                //   },
                // ]}
              >
                <Input placeholder="Chiều dài" suffix="cm" />
              </Item>
            </Col>
            <Col xs={24} lg={6}>
              <Item
                name={['defaultVariation', 'box_width_cm']}
                label="Rộng"
                {...layout}
                // rules={[
                //   {
                //     required: true,
                //     message: 'Please input your sku!',
                //   },
                // ]}
              >
                <Input placeholder="Chiều rộng" suffix="cm" />
              </Item>
            </Col>
            <Col xs={24} lg={6}>
              <Item
                name={['defaultVariation', 'box_height_cm']}
                label="Cao"
                {...layout}
                // rules={[
                //   {
                //     required: true,
                //     message: 'Please input your sku!',
                //   },
                // ]}
              >
                <Input placeholder="Chiều cao" suffix="cm" />
              </Item>
            </Col>
            <Col xs={24} lg={6}>
              <Item
                name={['defaultVariation', 'weight_grams']}
                label="Khối lượng"
                {...layout}
                // rules={[
                //   {
                //     required: true,
                //     message: 'Please input your sku!',
                //   },
                // ]}
              >
                <Input placeholder="Khối lượng" suffix="gr" />
              </Item>
            </Col>
          </Row>
        </div>
      </CustomSectionWrapper>
    </div>
  );
}

export default Shipping;
