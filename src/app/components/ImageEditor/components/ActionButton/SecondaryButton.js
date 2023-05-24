import React, { useState, useCallback, useEffect, memo } from 'react';

import { Button, Checkbox } from 'app/components';

import styled from 'styled-components/macro';

import { LIST_IMAGE_CONTENT_ELEMENT_ID } from '../ListImage';

export default memo(function SecondaryButton({
  currToolAction,
  emitAction,
  images,
  selectedImage,
  disableApply,
  disableDelete,
  disableReset,
  isApplyAll,
  setIsApplyAll,
  isApplyToNew,
  setIsApplyToNew,
  ...props
}) {
  const isImageIndex = index => {
    return selectedImage?.id === images[index]?.id;
  };

  const onChangeCheckBox = (e, setter) => {
    setter(e.target.checked);
  };

  const getListImageContentEleHeight = () => {
    return document.getElementById(LIST_IMAGE_CONTENT_ELEMENT_ID).clientHeight;
  };

  return (
    <ButtonActionWrapper {...props}>
      <div className="wrapper-inner">
        <div className="optionals-wrapper">
          <Checkbox
            className="option-to-new"
            checked={isApplyToNew}
            onChange={e => {
              onChangeCheckBox(e, setIsApplyToNew);
            }}
          >
            Lưu mới
            <div className="info-tooltip-wrapper">
              <i className="icon-info far fa-question-circle"></i>
              <div className="info-tooltip-content">
                <div className="info-tooltip-inner">
                  <span className="info-title">Lưu mới:</span>
                  <span className="info-content">
                    hệ thống sẽ tạo mới file ảnh khác.
                    <br />
                    Hình ảnh gốc vẫn được giữ nguyên như ban đầu.
                  </span>
                </div>
              </div>
            </div>
          </Checkbox>
          <Checkbox
            className="option-apply-all"
            checked={isApplyAll}
            onChange={e => {
              onChangeCheckBox(e, setIsApplyAll);
            }}
          >
            Áp dụng tất cả
            <div className="info-tooltip-wrapper">
              <i className="icon-info far fa-question-circle"></i>
              <div className="info-tooltip-content">
                <div className="info-tooltip-inner">
                  <span className="info-title">Áp dụng cho tất cả:</span>
                  <span className="info-content">
                    Bạn chỉ cần thiết kế trên
                    <br />
                    một ảnh, các ảnh khác sẽ tự động được áp dụng.
                  </span>
                </div>
              </div>
            </div>
          </Checkbox>
        </div>
        <Button
          disabled={disableApply}
          context="secondary"
          width={86}
          className="btn-apply btn-sm br-6"
          onClick={() => {
            emitAction({
              type: 'EXPORT_TO_IMAGE',
            });
          }}
          color="blue"
        >
          Áp dụng
        </Button>
      </div>
    </ButtonActionWrapper>
  );
});

export const ButtonActionWrapper = styled.div`
  border-right: 1px solid #ebebf0;
  .br-6 {
    border-radius: 6px;
  }

  .wrapper-inner {
    display: inline-flex;
    padding: 12px 24px 11px 21px;
  }
  .optionals-wrapper {
    display: flex;
    align-items: center;
    & > label:not(:first-child) {
      margin-left: 19px !important;
    }
    .icon-info {
      color: #828282;
    }
    .ant-checkbox-wrapper + .ant-checkbox-wrapper {
      margin-left: 0;
    }
    .ant-checkbox-inner {
      border-radius: 4px;
    }
    .ant-checkbox-checked {
      &:after {
        border: none;
      }
      & > .ant-checkbox-inner {
        background-color: ${({ theme }) => theme.primary};
        border-color: transparent;
        border-radius: 4px;
      }
    }
    .ant-checkbox-wrapper {
      color: ${({ theme }) => theme.primary};
    }
    .ant-checkbox + span {
      padding-right: 0;
      padding-left: 7px;
      color: ${({ theme }) => theme.grayBlue};
    }
    .info-tooltip-wrapper {
      margin-left: 6px;
      position: relative;
      display: inline-flex;
      color: ${({ theme }) => theme.gray2};
      &:hover {
        .info-tooltip-content {
          display: block;
        }
      }
      .info-tooltip-content {
        display: none;
        position: absolute;
        width: 345px;
        top: calc(100% + 20px);
        left: 50%;
        transform: translateX(-50%);
        z-index: 999;
        .info-tooltip-inner {
          padding: 19px 19px 11px 19px;
          height: 90px;
          background: #ffffff;
          border-radius: 4px;
          box-shadow: 0px 2px 16px rgba(0, 0, 0, 0.2);
          line-height: 1.6;

          &:after {
            content: '';
            position: absolute;
            display: block;
            width: 20px;
            height: 20px;
            background: #fff;
            top: 5px;
            left: 50%;
            transform: translateX(-50%) translateY(-50%) rotate(45deg);
          }
        }
      }
      .info-title {
        font-weight: bold;
      }
      .info-content {
        margin-left: 5px;
      }
    }
  }
  .btn-apply {
    margin-left: 18px;
  }
`;
