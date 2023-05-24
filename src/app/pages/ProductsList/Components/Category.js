import React, { memo } from 'react';
import { Row, Col, Tooltip } from 'antd';
import { Button, Select, Form } from 'app/components';
import { CustomStyle } from 'styles/commons';
import Styled from 'styled-components';
import { CustomSectionWrapper } from './styled';
const Item = Form.Item;

export default memo(function Category({
  data = [],
  onClick,
  layout,
  disabled,
  odiiCat,
  styleWrapper = {},
  hiddenTitle,
  handleSelectCat,
  // TuanTh
  selectOption = {},
}) {
  const handleSelect = e => {
    handleSelectCat(e.target.value);
  };

  return (
    <CustomSectionWrapper mt={{ xs: 's4' }} {...styleWrapper}>
      {hiddenTitle || <div className="title">Danh mục sản phẩm</div>}
      <CustomStyle mb={{ xs: 's7' }} {...styleWrapper}>
        <Row gutter={24}>
          <Col span={24}>
            <Item
              name="primary_cat_id"
              label=""
              placeholder="Vui lòng chọn cửa hàng"
              {...layout}
              rules={[
                {
                  required: true,
                  message: 'Vui lòng chọn danh mục',
                },
              ]}
            >
              <Select
                disabled={disabled}
                placeholder="Vui lòng chọn danh mục"
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
                {...selectOption}
              >
                {data?.map(v => (
                  <Select.Option
                    key={v.shop_cat_id}
                    value={v.shop_cat_id}
                    label={v.display_path}
                    // disabled={
                    //   v.status === 'inactive' ||
                    //   v.auth_status === 'token_expired'
                    // }
                  >
                    <CustomStyle
                      pr={{ xs: 's3' }}
                      display="flex"
                      alignItems="center"
                    >
                      <CustomStyle width="calc(100% - 20px)">
                        <Tooltip mouseEnterDelay={0.8} title={v.display_path}>
                          {v.display_path}
                        </Tooltip>
                      </CustomStyle>
                    </CustomStyle>
                  </Select.Option>
                ))}
              </Select>
            </Item>
          </Col>
        </Row>
        {/* <div className="title">Danh mục sản phẩm theo Odii</div> */}
        {/* <CustomStyle color="default">
          {odiiCat ? (
            <CustomStyle display="flex" color="primary" fontWeight="medium">
              {odiiCat.map((item, i) => (
                <Tooltip mouseEnterDelay={0.5} title={item.name} key={item.id}>
                  <CustomText>
                    {i === 0 ? '' : ' / '}
                    {item.name}
                  </CustomText>
                </Tooltip>
              ))}
            </CustomStyle>
          ) : disabled ? (
            'Vui lòng chọn cửa hàng!'
          ) : (
            'Chọn danh mục cho sản phẩm!'
          )}
        </CustomStyle> */}
      </CustomStyle>
    </CustomSectionWrapper>
  );
});

const CustomText = Styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  &:last-child {
    color: ${({ theme }) => theme.primary};
  }
`;

const CustomButton = Styled(Button)`
justify-content: flex-start;
  &:hover, &.active {
    /* background: transparent !important; */
    /* color: #fff !important; */
  }
  span {
    overflow: hidden;
    text-align: justify;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
    -webkit-line-clamp: 1;
  }
`;
