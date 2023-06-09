import React, { memo } from 'react';
import { Row, Col } from 'antd';
import { Input, Form } from 'app/components';
import { CustomSectionWrapper } from './styled';

const { TextArea } = Input;

const Item = Form.Item;

export default memo(function ShortDescription({ layout }) {
  return (
    <CustomSectionWrapper mt={{ xs: 's4' }}>
      <div className="title">Mô tả ngắn</div>
      <Row gutter={24}>
        <Col span={24}>
          <Item
            name="short_description"
            label=""
            {...layout}
            // rules={[
            //   {
            //     required: true,
            //     message: 'Please input your short_description!',
            //   },
            //   {
            //     min: 20,
            //     message: 'Short Description must be minimum 20 characters.',
            //   },
            // ]}
          >
            <TextArea
              showCount
              maxLength={500}
              rows={4}
              placeholder="Nhập mô tả ngắn"
            />
          </Item>
        </Col>
      </Row>
    </CustomSectionWrapper>
  );
});
