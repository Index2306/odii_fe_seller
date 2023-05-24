import React, { useState, useRef, useEffect, memo } from 'react';

import styled from 'styled-components/macro';
import { ACTION_ADD, ACTION_UPDATE, EDIT_TAB_INDEX } from '.';
import { Empty } from 'antd';

// const EmptyIcon = Empty.PRESENTED_IMAGE_SIMPLE;

export default memo(function ListText({
  emitAction,
  setLoading,
  updateCurrentAction,
  toolbarActionType,
  currToolAction,
  currentAction,
  setCurrentAction,
  selectedPlainText,
  plainTextLayers,
  setCurrentTabIndex,
}) {
  const editText = text => {
    emitAction({
      type: 'SET_SELECTED_TEXT',
      data: text.id,
    });
    setCurrentTabIndex(EDIT_TAB_INDEX);
    setCurrentAction(ACTION_UPDATE);
  };

  const removeText = text => {
    emitAction({
      type: 'DELETE_TEXT',
      data: text.id,
    });
  };

  const sortedList =
    (plainTextLayers && plainTextLayers.sort((a, b) => b.id - a.id)) || [];

  // if (!plainTextLayers || !plainTextLayers.length) {
  //   return (
  //     <ListTextWrapper>
  //       <div className="content-empty">
  //         <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
  //         <div className="help-info">
  //           <i class="info-icon fas fa-info-circle"></i>
  //           <span className="info-description">
  //             Chọn chữ trong danh sách hoặc trên màn hình design, sau đó click
  //             vào Thêm/Sửa để sửa chữ. Khi không có chữ được chọn thì sẽ ở chế
  //             độ thêm
  //           </span>
  //         </div>
  //       </div>
  //     </ListTextWrapper>
  //   );
  // }

  return (
    <ListTextWrapper>
      <div
        className="btn-add"
        onClick={() => {
          emitAction({
            type: 'SET_SELECTED_TEXT',
            data: null,
          });
          setCurrentTabIndex(EDIT_TAB_INDEX);
          setCurrentAction(ACTION_ADD);
        }}
      >
        <i className="far fa-plus"></i>
        <span className="btn-add__text">Tạo mới</span>
      </div>
      <div className="list-text">
        {sortedList.map((textObj, index) => (
          <div
            key={index}
            className="text-item"
            aria-active={textObj.id === selectedPlainText?.id}
          >
            <i className="text-icon far fa-font-case"></i>
            <span className="text-value">{textObj.text}</span>
            <div className="text-actions">
              <div
                className="text-action"
                onClick={() => {
                  editText(textObj);
                }}
              >
                <i className="fas fa-edit"></i>
              </div>
              <div
                className="text-action"
                onClick={() => {
                  removeText(textObj);
                }}
              >
                <i className="far fa-trash"></i>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ListTextWrapper>
  );
});

export const ListTextWrapper = styled.div`
  padding-bottom: 15px;
  .btn-add {
    color: #3d56a6;
    border: 1px solid #ebebf0;
    box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.05);
    border-radius: 4px;
    height: 36px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 5px;
  }
  .btn-add__text {
    margin-left: 5px;
  }
  .content-empty {
    margin-top: -5px;
    .ant-empty-normal {
      margin: 30px 0;
      .ant-empty-image {
        height: 30px;
        margin-bottom: 3px;
      }
    }
    .help-info {
      text-align: center;
      line-height: 2;
      margin-top: -15px;
      font-size: 13px;
      color: ${({ theme }) => theme.gray3};
    }
    .info-icon {
      font-size: 14px;
    }
    .info-description {
      margin-left: 7px;
    }
  }
  .text-item {
    cursor: pointer;
    position: relative;
    user-select: none;
    background: #f7f7f9;
    border-radius: 4px;
    padding: 11px 15px;
    border: 1px solid transparent;
    transition: all ease-out 0.2s;
    &[aria-active='true'] {
      border-color: #40a9ff;
    }
    :hover {
      background: #e3e3e3;
    }
    /* :not(:first-child) { */
    margin-top: 16px;
    /* } */
    .text-value {
      /* display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden; */
      margin-left: 11px;
    }
    .text-icon {
      font-weight: 900;
      font-size: 18px;
      color: #bdbdbd;
    }
    .text-actions {
      position: absolute;
      display: none;
      right: 7px;
      top: 50%;
      transform: translateY(-50%);
      .text-action {
        width: 26px;
        height: 26px;
        border-radius: 4px;
        border: 1px solid transparent;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #fff;
        box-shadow: rgba(30, 70, 117, 0.05) 0px 4px 10px;
        transition: all ease-out 0.15s;
        transform: scale(1);
        &:hover {
          border-color: ${({ theme }) => theme.primary};
        }
        &:active {
          transform: scale(0.85);
        }
        i {
          font-size: 13px;
        }
        :not(:first-child) {
          margin-left: 6px;
        }
      }
    }
    &:hover {
      .text-actions {
        display: flex;
      }
    }
  }
`;
