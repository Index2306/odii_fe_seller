import React, { memo, useState, useEffect } from 'react';
import { Row, Col, Form as F, Modal } from 'antd';

import { isEmpty } from 'lodash';

import styled from 'styled-components/macro';

import { PicturesWall } from 'app/components/Uploads';
import { Avatar } from 'app/components/Uploads';
import { CustomH3, CustomStyle } from 'styles/commons';
import { CustomSectionWrapper } from './styled';
import ImageEditor from 'app/components/ImageEditor';
const Item = F.Item;

export default memo(function ProductImages({
  layout,
  images,
  productId,
  reloadData = () => null,
  listIds = [],
  hiddenTitle,
  CustomTitle,
  leftCol = 8,
  styleWrapper = {},
}) {
  const [isShowImageEditorModal, setShowImageEditorModal] = useState(false);
  const normFile = e => {
    if (Array.isArray(e)) {
      return e;
    }
    return e;
  };
  const handleReloadData = () => {
    const listIdsClone = [...listIds];
    listIdsClone.forceUpdate = true;
    reloadData(listIdsClone);
  };
  return (
    <CustomSectionWrapper mt={{ xs: 's4' }} {...styleWrapper}>
      <CustomStyle display="flex" justifyContent="space-between">
        <CustomStyle display="flex">
          <div className={`${hiddenTitle ? 'd-none ' : ''}title`}>
            Hình ảnh sản phẩm
          </div>
          {CustomTitle ? CustomTitle : ''}
        </CustomStyle>
        <CustomStyle
          fontWeight="medium"
          color="primary"
          className="pointer"
          onClick={() => setShowImageEditorModal(true)}
        >
          Chỉnh sửa ảnh
        </CustomStyle>
      </CustomStyle>
      <Row gutter={12}>
        <Col span={leftCol}>
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
        </Col>
        <Col span={24 - leftCol}>
          <Item
            name="store_product_images"
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
            <PicturesWall
              multiple
              maxImages={8}
              url={`product-service/product/upload-store-product-image?store_product_id=${productId}`}
            />
          </Item>
        </Col>
      </Row>
      <ImageEditorModal
        // width="1068px"
        visible={isShowImageEditorModal}
        onCancel={() => setShowImageEditorModal(false)}
        title={null}
        footer={null}
      >
        <div className="image-editor-content">
          <ImageEditor
            productId={productId}
            images={images}
            onFinish={() => {
              setShowImageEditorModal(false);
              handleReloadData();
            }}
          ></ImageEditor>
        </div>
      </ImageEditorModal>
    </CustomSectionWrapper>
  );
});

export const ImageEditorModal = styled(Modal)`
  width: 100% !important;
  max-width: 1300px;
  top: 60px;
  padding-bottom: 0;
  .ant-spin-nested-loading > div > .ant-spin {
    max-height: unset;
  }
  .image-editor-content {
    height: 100%;
  }
  .ant-modal-content {
    height: 100%;
  }
  .ant-modal-body {
    height: calc(100vh - 120px);
    padding: 0;
  }
  .ant-modal-close {
    right: 0;
    top: 0;
    transform: translateX(50%) translateY(-50%);
  }
  .ant-modal-close-x {
    width: 29px;
    height: 29px;
    background: #fff;
    border-radius: 100%;
    line-height: 30px;
    & > .anticon-close {
      background: ${({ theme }) => theme.primary};
      color: #fff;
      border-radius: 100%;
      width: 20px;
      height: 20px;
      display: inline-flex;
      justify-content: center;
      align-items: center;
    }
    svg {
      width: 12px;
    }
  }
`;
