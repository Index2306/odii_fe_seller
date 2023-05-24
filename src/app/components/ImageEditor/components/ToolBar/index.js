import React, { useState, useEffect, memo } from 'react';

import styled, { keyframes } from 'styled-components/macro';
import {
  TOOL_ACTION_ADD_IMAGE,
  TOOL_ACTION_CROP_BACKGROUND,
  TOOL_ACTION_SET_FRAME_TEMPLATE,
  TOOL_ACTION_ADD_TEXT,
} from '../..';
import CropTool from './CropTool';
import FrameTool from './FrameTool';
import ImageTool from './ImageTool';
import TextTool from './TextTool';

const TOOL_ITEMS_LENGTH = 4;
const TOOL_ITEMS_HEIGHT = '100vh - 120px';
const TOOL_ITEMS_COLLAPSE_HEIGHT = '55px';
const TOOL_ITEM_HEIGHT = `${TOOL_ITEMS_HEIGHT} - ${TOOL_ITEMS_COLLAPSE_HEIGHT} * ${
  TOOL_ITEMS_LENGTH - 1
}`;
const TOOL_ITEM_CHILDRENS_HEIGHT = `${TOOL_ITEMS_HEIGHT} - ${TOOL_ITEMS_COLLAPSE_HEIGHT} * ${TOOL_ITEMS_LENGTH}`;

export default memo(function ToolBar({
  emitAction,
  setLoading,
  currToolAction,
  plainTextLayers,
  selectedPlainText,
  setSelectedPlainText,
  ...props
}) {
  const [openParentIndex, setOpenParentIndex] = useState(-1);

  const genToolBarItemAttr = (
    index,
    toolbarActionType,
    setOpened,
    handleClick,
  ) => {
    const isFocused = openParentIndex === index;

    return {
      'aria-active': currToolAction === toolbarActionType,
      onClick: e => {
        setOpenParentIndex(index);
        if (!isFocused) {
          setOpenParentIndex(index);
          setOpened({ isForce: true, state: true });
        } else {
          setOpened({});
        }
        handleClick && handleClick();
      },
    };
  };

  const defaultProps = {
    emitAction,
    setLoading,
    openParentIndex,
    genToolBarItemAttr,
    currToolAction,
  };

  return (
    <ToolBarWrapper {...props}>
      <CropTool
        {...defaultProps}
        itemIndex={0}
        toolbarActionType={TOOL_ACTION_CROP_BACKGROUND}
      ></CropTool>
      <FrameTool
        {...defaultProps}
        itemIndex={1}
        toolbarActionType={TOOL_ACTION_SET_FRAME_TEMPLATE}
      ></FrameTool>
      <ImageTool
        {...defaultProps}
        itemIndex={2}
        toolbarActionType={TOOL_ACTION_ADD_IMAGE}
      ></ImageTool>
      <TextTool
        {...defaultProps}
        itemIndex={3}
        toolbarActionType={TOOL_ACTION_ADD_TEXT}
        plainTextLayers={plainTextLayers}
        selectedPlainText={selectedPlainText}
        setSelectedPlainText={setSelectedPlainText}
      ></TextTool>
    </ToolBarWrapper>
  );
});

export const ToolBarWrapper = styled.div`
  width: 260px;
  border-right: 1px solid #ebebf0;
  user-select: none;
  .toolbar-item {
    border-bottom: 1px solid #ebebf0;
    position: relative;
    z-index: 1;
    height: 55px;
    overflow: hidden;
    .item-icon {
      font-size: 15px;
      font-weight: 400;
    }
    .item-title {
      margin-left: 10px;
    }
    .item-parent {
      background: #fff;
      color: ${({ theme }) => theme.grayBlue};
      font-weight: 500;
      cursor: pointer;
      padding: 16px 12px 16px 16px;
      position: relative;
      z-index: 2;
      transition: all ease-out 0.2s;
      :before {
        content: '';
        width: 4px;
        height: calc(100% - 10px);
        position: absolute;
        top: 5px;
        left: 0;
        background: transparent;
        border-radius: 0px 6px 6px 0px;
        transition: all ease-out 0.2s;
      }
    }
    & > .item-parent + .item-childrens-scroll {
      opacity: 0;
      position: relative;
      z-index: 0;
      overflow: auto;
      position: relative;
      top: -20%;
      transition: all ease-out 0.25s;
      /* scrollbar-width: thin;
      scroll-behavior: smooth;
      &::-webkit-scrollbar {
        width: 6px;
        background-color: white !important;
      }
      &::-webkit-scrollbar-thumb {
        background-color: #dedede !important;
      }
      &::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 6px rgb(127 127 127 / 20%);
        background-color: white !important;
      } */
    }
    &[aria-active='true'] > .item-parent {
      color: ${({ theme }) => theme.primary};
      :before {
        background: ${({ theme }) => theme.primary};
      }
    }
    & > .item-parent.has-children:after {
      content: '\f105';
      font-size: 12px;
      font-family: 'Font Awesome 5 Pro';
      line-height: 12px;
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: #bdbdbd;
      transition: all ease-in-out 0.2s;
    }
    &[aria-opended='true'] {
      height: calc(${TOOL_ITEM_HEIGHT});
      .item-childrens-scroll {
        opacity: 1;
        top: 0;
        transition: all ease-out 0.25s;
        height: calc(${TOOL_ITEM_CHILDRENS_HEIGHT});
      }
      .item-parent.has-children {
        border-bottom: 1px solid #ebebf0;
      }
      .item-parent.has-children:after {
        transform: translateY(-50%) rotate(90deg);
      }
    }
  }
`;
