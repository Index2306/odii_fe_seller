import React, { memo } from 'react';
import { Row, Col, Form as F } from 'antd';
import { Input } from 'app/components';
import { CustomSectionWrapper } from './styled';

const Item = F.Item;

export default memo(function Vendor({ layout }) {
  return (
    <CustomSectionWrapper mt={{ xs: 's4' }}>
      <div className="title">Thương hiệu sản phẩm</div>
      <Row gutter={24}>
        <Col span={24}>
          <Item
            name="vendor"
            label=""
            {...layout}
            // rules={[
            //   {
            //     required: true,
            //     message: 'Please input your vendor!',
            //   },
            // ]}
          >
            <Input placeholder="Nhập thương hiệu sản phẩm" />
          </Item>
        </Col>
      </Row>
    </CustomSectionWrapper>
  );
});
