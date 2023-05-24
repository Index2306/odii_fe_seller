import React, { memo } from 'react';
import { Row, Col, Tooltip } from 'antd';
import { CustomStyle } from 'styles/commons';
import { Select, Form } from 'app/components';
import { defaultImage } from 'assets/images';
import constants from 'assets/constants';
import { Image } from 'antd';

import { CustomSectionWrapper } from './styled';
const Item = Form.Item;

const renderPlatform = platform => {
  if (!platform) return;
  const current = constants?.SALE_CHANNEL.find(
    item => item.id.toLowerCase() === platform,
  );
  return (
    <CustomStyle
      px={{ xs: 's3' }}
      // backgroundColor="background"
      display="flex"
      alignItems="center"
      color={current?.color}
      // border="1px solid"
      borderColor="stroke"
      borderRight="none"
      borderTopLeftRadius="4px"
      borderBottomLeftRadius="4px"
    >
      <CustomStyle width="14px">
        <img src={current?.icon} alt="" style={{ maxWidth: '100%' }} />
      </CustomStyle>
      {/* <CustomStyle pr={{ xs: 's1' }}>
         <Image src={current?.icon} alt="" width="14px" />
       </CustomStyle> */}
      {/* {current?.name} */}
    </CustomStyle>
  );
};
export default memo(function Store({ layout, listStores, disabled, title }) {
  return (
    <CustomSectionWrapper mt={{ xs: 's4' }}>
      <div className="title">
        {title || 'Chọn cửa hàng sẽ bán sản phẩm này'}
      </div>
      <Row gutter={24}>
        <Col span={24}>
          <Item
            name="store_id"
            label=""
            placeholder="Vui lòng chọn cửa hàng"
            {...layout}
            rules={[
              {
                required: true,
                message: 'Vui lòng chọn cửa hàng',
              },
            ]}
          >
            <Select
              disabled={disabled}
              placeholder="Vui lòng chọn cửa hàng"
              optionFilterProp="label"
              // defaultValue={text}
              // value={newStatus?.id === detail?.id ? newStatus?.name : text}
              // style={{ width: 120 }}
              // onSelect={handleShowConfirm(record)}
              // filterOption={(input, option) =>
              //   option.props.children
              //     .toLowerCase()
              //     .indexOf(input.toLowerCase()) >= 0
              // }
            >
              {listStores?.map(v => (
                <Select.Option
                  key={v.id}
                  value={v.id}
                  label={v.name}
                  disabled={
                    v.status === 'inactive' || v.auth_status === 'token_expired'
                  }
                >
                  <CustomStyle
                    pr={{ xs: 's3' }}
                    display="flex"
                    alignItems="center"
                  >
                    <CustomStyle
                      mr={{ xs: 's2' }}
                      width="16px"
                      display="flex"
                      alignItems="center"
                    >
                      <Image
                        fallback={defaultImage}
                        src={v.logo || defaultImage}
                        alt=""
                        style={{ maxWidth: '100%' }}
                      />
                    </CustomStyle>

                    <CustomStyle width="calc(100% - 20px)">
                      <Tooltip mouseEnterDelay={0.8} title={v.name}>
                        {v.name}
                      </Tooltip>
                    </CustomStyle>
                    {renderPlatform(v.platform)}
                  </CustomStyle>
                </Select.Option>
              ))}
            </Select>
          </Item>
        </Col>
      </Row>
    </CustomSectionWrapper>
  );
});
