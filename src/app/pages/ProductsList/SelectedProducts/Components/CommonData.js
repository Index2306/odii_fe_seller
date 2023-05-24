import React, { memo } from 'react';
import { Input, Form, Tags } from 'app/components';
import { Avatar } from 'app/components/Uploads';
import { Row, Col, Tooltip } from 'antd';
import { CustomStyle } from 'styles/commons';
import { isEmpty } from 'lodash';
import { Category } from 'app/pages/ProductsList/Components';
// import VietnamFlag from 'assets/images/flag/vietnam.svg';
import styled from 'styled-components';
import { nonAccentVietnamese } from 'utils/helpers';

const Item = Form.Item;

export default memo(function CommonData({
  layout,
  data,
  handleClickName,
  listChannel = [],
}) {
  const normFile = e => {
    if (Array.isArray(e)) {
      return e;
    }
    return e;
  };
  const {
    supplier,
    full_address,
    full_address_ret,
    origin_product_name,
    // id,
    platform,
  } = data;
  // const cate = data?.[`${platform}_product_categories_metadata`];
  return (
    <>
      <Row gutter={24}>
        <Col span={3}>
        <WrapperItemImage>
          <Item
            name="thumb"
            label=""
            valuePropName="data"
            getValueFromEvent={normFile}
            {...layout}
            // rules={[
            //   {
            //     required: true,
            //     message: 'Please input your status!',
            //   },
            // ]}
          >
            <Avatar />
          </Item>
         </WrapperItemImage>
        </Col>
        <Col span={21}>
          <CustomStyle mb={{ xs: 's4' }}>
            <CustomStyle display="flex" mb={{ xs: 's2' }}>
              <CustomStyle color="gray3" mr={{ xs: 's2' }}>
                Nguồn sản phẩm:
              </CustomStyle>
              <CustomStyle mr={{ xs: 's4' }}>
                <a
                  href={`/supplier/detail/${supplier?.id}`}
                  className="text-primary"
                >
                  {supplier?.name}
                </a>
              </CustomStyle>
              <CustomStyle color="gray3" mr={{ xs: 's2' }}>
                Kho lấy hàng:
              </CustomStyle>
              <CustomStyle display="flex" mr={{ xs: 's4' }}>
                {/* <CustomStyle mr={{ xs: 's2' }}>
                  <img src={VietnamFlag} alt="" className="img" />
                </CustomStyle> */}
                {full_address}
              </CustomStyle>
              <CustomStyle color="gray3" mr={{ xs: 's2' }}>
                Kho trả hàng:
              </CustomStyle>
              <CustomStyle display="flex" mr={{ xs: 's4' }}>
                {/* <CustomStyle mr={{ xs: 's2' }}>
                  <img src={VietnamFlag} alt="" className="img" />
                </CustomStyle> */}
                {full_address_ret}
              </CustomStyle>
            </CustomStyle>
            <CustomStyle
              onClick={handleClickName}
              className="pointer"
              color="primary"
            >
              {origin_product_name}
            </CustomStyle>
          </CustomStyle>

          <CustomStyle mb={-5}>
            <CustomStyle mb={-5} color="gray3">
              Tên sản phẩm trên cửa hàng
            </CustomStyle>
            <CustomNameInput>
              <Item
                name="name"
                label=""
                {...layout}
                rules={[
                  {
                    required: true,
                    message: 'Không được để trống ô tên!',
                  },
                  {
                    min: 10,
                    message:
                      'Tên sản phẩm của bạn quá ngắn. Vui lòng nhập ít nhất 10 kí tự.',
                  },
                  {
                    max: 120,
                    message:
                      'Tên sản phẩm của bạn quá dài. Vui lòng nhập tối đa 120 kí tự.',
                  },
                ]}
              >
                <Input
                  // showCount
                  // rows={2}
                  maxLength={150}
                  minLength={10}
                  placeholder="Nhập tên sản phẩm"
                />
              </Item>
            </CustomNameInput>
          </CustomStyle>

          <CustomStyle>
            <Row gutter={24}>
              <Col span={12}>
                <CustomStyle mb={{ xs: 's1' }} color="gray3">
                  Danh mục sản phẩm
                </CustomStyle>
                {platform ? (
                  <Category
                    // onClick={toggleCategoriesModal}
                    platform={platform}
                    hiddenTitle
                    styleWrapper={{ p: 0, mb: 0, mt: 0, border: 'none' }}
                    // odiiCat={
                    //   current?.[
                    //     `${current.platform}_product_categories_metadata`
                    //   ]
                    // }
                    disabled={isEmpty(listChannel)}
                    // data={current?.primary_cat_metadata}
                    data={listChannel}
                    // handleSelectCat={handleSetCurrent('primary_cat_metadata')}
                    // TuanTh
                    selectOption={{
                      showSearch: true,
                      filterOption: (input, option) => {
                        const inputUnsigned = nonAccentVietnamese(input);
                        const labelUnsigned = nonAccentVietnamese(option.label);
                        return labelUnsigned.indexOf(inputUnsigned) >= 0;
                      },
                    }}
                  />
                ) : (
                  <WrapperItem>
                    <CustomStyle display="flex" className="cate">
                      <CustomStyle color="gray1" opacity={0.7}>
                        Vui lòng chọn cửa hàng
                      </CustomStyle>
                    </CustomStyle>
                  </WrapperItem>
                )}
              </Col>
              <Col span={12}>
                <CustomStyle mb={{ xs: 's1' }} color="gray3">
                  <Tooltip title="Tối đa 5 tags, Enter để thêm tag mới">
                    Tag sản phẩm
                  </Tooltip>
                </CustomStyle>
                <WrapperItem>
                  <Item
                    // defaultValue={tags}
                    name="tags"
                    label=""
                    valuePropName="data"
                    getValueFromEvent={normFile}
                    {...layout}
                  >
                    <Tags max={5} defaultShowInput />
                  </Item>
                </WrapperItem>
              </Col>
            </Row>
          </CustomStyle>
        </Col>
      </Row>
    </>
  );
});

const CustomNameInput = styled.div`
  .ant-input {
    border: none;
    padding-left: 0;
    border-radius: 0;
    border-bottom: 1px solid ${({ theme }) => theme.gray3};
    &:focus {
      box-shadow: none;
    }
  }
`;

// const CustomText = styled.span`
//   white-space: nowrap;
//   overflow: hidden;
//   text-overflow: ellipsis;
//   &:last-child {
//     color: ${({ theme }) => theme.primary};
//   }
// `;

const WrapperItem = styled.div`
  label {
    visibility: hidden;
  }
  .cate,
  .ant-form-item-control {
    border: 1px solid ${({ theme }) => theme.stroke};
    border-radius: 0px 4px 4px 0px;
  }
  .cate {
    height: 40px;
    padding: 8px 12px;
  }
  .ant-form-item-control-input-content {
    padding: 5px 6px 0;
    /* min-height: 38px; */
    > * {
      display: flex;
      flex-wrap: wrap;
    }
  }
  .ant-tag,
  .ant-input {
    height: 28px;
  }

  .ant-input {
    border: none;
    flex: 1;
    box-shadow: none;
  }
 
`;
const WrapperItemImage = styled.div`
  .ant-image-img{
    max-height: 160px !important;
  }
`;
