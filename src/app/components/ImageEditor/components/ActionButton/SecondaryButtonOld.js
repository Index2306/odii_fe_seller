import React, { useState, useCallback, useEffect, memo } from 'react';

import { Button, Checkbox } from 'app/components';
import { Tooltip } from 'antd';

import styled from 'styled-components/macro';

// import {
//   TOOL_ACTION_CROP_BACKGROUND,
//   TOOL_ACTION_SET_FRAME_TEMPLATE,
// } from '../index';
import { LIST_IMAGE_CONTENT_ELEMENT_ID } from '../ListImage';

export default memo(function SecondaryButton({
  currToolAction,
  emitAction,
  images,
  selectedImage,
  disableExport,
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
      <div className="options-wrapper">
        <Checkbox
          className="option-apply-all"
          checked={isApplyAll}
          onChange={e => {
            onChangeCheckBox(e, setIsApplyAll);
          }}
        >
          Áp dụng tất cả
        </Checkbox>
        <Checkbox
          className="option-to-new"
          checked={isApplyToNew}
          onChange={e => {
            onChangeCheckBox(e, setIsApplyToNew);
          }}
        >
          Lưu mới
        </Checkbox>
      </div>
      <div className="primary-button-wrapper">
        <Button
          disabled={disableExport}
          context="secondary"
          width={170}
          className="btn-export btn-sm"
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
      <div className="secondary-button-wrapper">
        <div className="slide-pagination">
          <Tooltip
            mouseEnterDelay={0.25}
            placement="bottomLeft"
            title="Ảnh trước"
          >
            <div
              className="btn-secondary prev-slide"
              aria-disabled={isImageIndex(0)}
              onClick={() => {
                emitAction({
                  type: 'NAV_IMAGE',
                  data: {
                    isNext: false,
                    viewHeight: getListImageContentEleHeight(),
                  },
                });
              }}
            >
              <i className="fas fa-arrow-alt-left"></i>
            </div>
          </Tooltip>
          <Tooltip
            mouseEnterDelay={0.25}
            placement="bottomLeft"
            title="Ảnh tiếp theo"
          >
            <div
              className="btn-secondary next-slide"
              aria-disabled={isImageIndex(images.length - 1)}
              onClick={() => {
                emitAction({
                  type: 'NAV_IMAGE',
                  data: {
                    isNext: true,
                    viewHeight: getListImageContentEleHeight(),
                  },
                });
              }}
            >
              <i className="fas fa-arrow-alt-right"></i>
            </div>
          </Tooltip>
        </div>
        <Tooltip
          mouseEnterDelay={0.25}
          placement="bottomLeft"
          title={<span>Xóa ảnh mới tạo</span>}
        >
          <div
            className="btn-secondary reset-frame"
            aria-disabled={disableDelete}
            onClick={() => {
              emitAction({ type: 'REMOVE_BACKGROUND' });
            }}
          >
            <i className="far fa-trash"></i>
          </div>
        </Tooltip>

        {/* Ẩn reset */}
        {/* <Tooltip  
          mouseEnterDelay={0.25}
          placement="bottomLeft"
          title={
            currToolAction === TOOL_ACTION_SET_FRAME_TEMPLATE ? (
              <span>
                Reset khung viền <br></br> về trạng thái ban đầu
              </span>
            ) : currToolAction === TOOL_ACTION_CROP_BACKGROUND ? (
              <span>
                Reset crop về <br></br> trạng thái ban đầu
              </span>
            ) : null
          }
        >
          {(currToolAction === TOOL_ACTION_SET_FRAME_TEMPLATE ||
            currToolAction === TOOL_ACTION_CROP_BACKGROUND) && (
            <div
              className="btn-secondary reset-frame"
              aria-disabled={!currToolAction}
              onClick={() => {
                emitAction({ type: 'RESET_TOOL_STATE' });
              }}
            >
              <i className="far fa-redo"></i>
            </div>
          )}
        </Tooltip> */}
        {!disableReset && (
          <Tooltip
            mouseEnterDelay={0.25}
            placement="bottomLeft"
            title={<span>Reset ảnh về ban đầu</span>}
          >
            <div
              className="btn-secondary reset-frame"
              aria-disabled={!currToolAction}
              onClick={() => {
                emitAction({ type: 'RESET_ALL' });
              }}
            >
              <i className="far fa-redo"></i>
            </div>
          </Tooltip>
        )}
      </div>
    </ButtonActionWrapper>
  );
});

export const ButtonActionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid rgb(230, 230, 233);
  box-shadow: rgba(30, 70, 117, 0.05) 0px 4px 10px;
  border-radius: 6px;
  padding: 20px;
  margin-left: 35px;
  /* margin-right: -17px; */
  .options-wrapper {
    display: flex;
    flex-direction: column;
    .ant-checkbox-wrapper + .ant-checkbox-wrapper {
      margin-left: 0;
    }
    .option-to-new {
      margin-top: 5px;
    }
    .ant-checkbox-checked .ant-checkbox-inner {
      background-color: ${({ theme }) => theme.primary};
      border-color: ${({ theme }) => theme.primary};
    }
    .ant-checkbox-wrapper {
      color: ${({ theme }) => theme.primary};
    }
    .ant-checkbox + span {
      padding-right: 10px;
      padding-left: 10px;
    }
  }
  .primary-button-wrapper {
    margin-top: 15px;
  }

  .copy-edit-frame {
    cursor: pointer;
    padding: 4px 20px;
    color: ${({ theme }) => theme.gray};
    background: #e5e5e5;
    border: 1px solid ${({ theme }) => theme.primary};
    border-radius: 4px;
    &:hover {
      background: ${({ theme }) => theme.primary};
      color: #fff;
    }
  }
  .secondary-button-wrapper {
    display: flex;
    justify-content: center;
    margin-top: 17px;
    .slide-pagination {
      display: flex;
    }
    [aria-disabled='true'],
    [aria-disabled='true'] {
      cursor: default;
      pointer-events: none;
      opacity: 0.5;
    }
    .next-slide {
      margin-left: 12px;
    }
    .reset-frame {
      margin-left: 12px;
    }
    .btn-secondary {
      color: #9f9f9f;
      cursor: pointer;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      height: 28px;
      width: 32px;
      font-size: 16px;
      border-radius: 4px;
      border: 1px solid rgb(217, 217, 217);
      &:hover {
        border-color: ${({ theme }) => theme.primary};
        color: ${({ theme }) => theme.primary};
        transition: all ease-out 0.2s;
      }
    }
  }
`;
