import React, { useState, useCallback, useEffect, memo } from 'react';

import styled from 'styled-components/macro';

import { Scrollbars } from 'react-custom-scrollbars';
import ListText from './ListText';
import EditText from './EditText';

export const DEFAULT_TAB_INDEX = 0;
export const EDIT_TAB_INDEX = 1;
export const ACTION_ADD = 0;
export const ACTION_UPDATE = 1;

export default memo(function TextTool({
  emitAction,
  setLoading,
  genToolBarItemAttr,
  toolbarActionType,
  openParentIndex,
  currToolAction,
  itemIndex,
  plainTextLayers,
  selectedPlainText,
  setSelectedPlainText,
  ...props
}) {
  const [currentTabIndex, setCurrentTabIndex] = useState(DEFAULT_TAB_INDEX);
  const [currentAction, setCurrentAction] = useState(null);
  const [isOpened, setOpened] = useState(false);

  const TEXT_TOOL_TABS = [
    {
      title: 'Danh sách chữ',
      content: _props => <ListText {..._props}></ListText>,
    },
    {
      title: 'Thêm / Sửa',
      content: _props => <EditText {..._props}></EditText>,
    },
  ];

  const updateCurrentAction = () => {
    emitAction({
      type: 'UPDATE_TOOL_ACTION',
      data: toolbarActionType,
    });
  };

  const defaultPropsToChildrens = {
    emitAction,
    setLoading,
    updateCurrentAction,
    toolbarActionType,
    currToolAction,
    currentAction,
    selectedPlainText,
    setCurrentAction,
    setCurrentTabIndex,
  };

  const getContent = () => {
    const currContent = TEXT_TOOL_TABS[currentTabIndex];
    switch (currentTabIndex) {
      case 0:
        return currContent.content({
          ...defaultPropsToChildrens,
          plainTextLayers,
        });
      case 1:
        return currContent.content({
          ...defaultPropsToChildrens,
          setSelectedPlainText,
        });
      default:
        return <></>;
    }
  };

  const setOpenedExternal = ({ isForce, state }) => {
    setOpened(isForce ? state : !isOpened);
  };

  useEffect(() => {
    if (currToolAction !== toolbarActionType) {
      setCurrentTabIndex(DEFAULT_TAB_INDEX);
    }
  }, [currToolAction]);

  return (
    <TextToolWrapper
      className="toolbar-item"
      aria-opended={isOpened && itemIndex === openParentIndex}
      {...genToolBarItemAttr(itemIndex, toolbarActionType, setOpenedExternal)}
      {...props}
    >
      <div className="item-parent has-children">
        <i className="fa fa-text-size item-icon" aria-hidden="true"></i>
        <span className="item-title">Thêm chữ</span>
      </div>
      <div
        className="item-childrens-scroll"
        onClick={e => {
          e.stopPropagation();
        }}
      >
        <div className="list-text-content">
          <div className="text-tool-tabs">
            <div className="tabs-title">
              {/* <div className="tabs-title__inner">
                {TEXT_TOOL_TABS.map((tab, index) => (
                  <div
                    key={index}
                    aria-active={index === currentTabIndex}
                    className="tab-title"
                    onClick={() => {
                      setCurrentTabIndex(index);
                    }}
                  >
                    {tab.title}
                  </div>
                ))}
              </div> */}
            </div>
            <Scrollbars
              autoHide
              // autoHideTimeout={150}
              // autoHideDuration={250}
              heightRelativeToParent="100%"
            >
              <div className="tab-content">{getContent()}</div>
            </Scrollbars>
          </div>
        </div>
      </div>
    </TextToolWrapper>
  );
});

export const TextToolWrapper = styled.div`
  .list-text-content {
    height: 100%;
    display: block;
    padding: 15px 0;
    overflow-y: hidden;
  }
  .text-tool-tabs {
    height: 100%;
  }
  .tabs-title {
    cursor: pointer;
    user-select: none;
    padding: 0 16px;
    transition: all ease-out 0.25s;
    .tabs-title__inner {
      border-bottom: 1px solid #ebebf0;
      display: flex;
    }
    .tab-title {
      position: relative;
      padding-bottom: 5px;
      font-weight: 500;
      width: 50%;
      text-align: center;
      color: ${({ theme }) => theme.gray3};
      &:after {
        content: '';
        position: absolute;
        bottom: -1px;
        left: 0;
        width: 100%;
        transform: scaleX(0);
        height: 1px;
        background: ${({ theme }) => theme.primary};
        transition: all ease-out 0.25s;
      }
      &[aria-active='true'] {
        color: ${({ theme }) => theme.primary};
        &:after {
          transform: scaleX(1);
        }
      }
    }
  }
  .tab-content {
    /* margin-top: 10px; */
    /* padding: 10px 16px 25px 16px; */
    padding: 0 16px 25px 16px;
  }
`;
