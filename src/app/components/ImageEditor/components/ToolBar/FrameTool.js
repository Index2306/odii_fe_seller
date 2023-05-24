import React, { useState, useRef, useEffect, memo } from 'react';
import { Skeleton } from 'antd';

import request from 'utils/request';

import styled from 'styled-components/macro';
import { genImgUrl } from 'utils/helpers';

import { transparent } from 'assets/images';

import { Scrollbars } from 'react-custom-scrollbars';

const FRAME_TEMPLATE_BASE_URL_ = 'design-service/seller/artwork-frame-template';
const FRAME_IMG_SIZE = 130;

export default memo(function FrameTool({
  hasFrame,
  emitAction,
  setLoading,
  genToolBarItemAttr,
  toolbarActionType,
  openParentIndex,
  currToolAction,
  itemIndex,
  ...props
}) {
  const [isLoadingInternal, setLoadingInternal] = useState(false);
  const [frameTemplates, setFrameTemplates] = useState([]);
  const [selectedChildrenIndex, setSelectedChildrenIndex] = useState(-1);
  const [isOpened, setOpened] = useState(false);
  const [isOpenedAgo, setIsOpenedAgo] = useState(false);

  const setOpenedExternal = ({ isForce, state }) => {
    setOpened(isForce ? state : !isOpened);
  };

  useEffect(() => {
    isOpened && setIsOpenedAgo(true);
  }, [isOpened]);

  useEffect(() => {
    if (currToolAction !== toolbarActionType) {
      setSelectedChildrenIndex(-1);
    }
  }, [currToolAction]);

  useEffect(() => {
    if (isOpenedAgo) {
      getData();
    }
  }, [isOpenedAgo]);

  const sortDesign = designs => {
    return designs.sort((a, b) => a.id - b.id);
  };

  const getData = async () => {
    setLoadingInternal(true);
    const { is_success, data } = await request(FRAME_TEMPLATE_BASE_URL_);
    if (is_success) {
      setFrameTemplates(sortDesign(data?.designs || []));
    }
    setTimeout(() => {
      setLoadingInternal(false);
    }, 100);
  };

  const genFrameItemAttr = (index, frame, handleClick) => {
    const isCurrChildrenSeleted = selectedChildrenIndex === index;
    if (isCurrChildrenSeleted) {
      return {
        'aria-active': true,
        onClick: () => {
          setSelectedChildrenIndex(-1);
          emitAction({
            type: 'UNSET_TOOL_ACTION',
            data: toolbarActionType,
          });
          handleClick && handleClick();
        },
      };
    }

    return {
      'aria-active': false,
      onClick: () => {
        setSelectedChildrenIndex(index);
        emitAction({
          type: 'UPDATE_TOOL_ACTION',
          data: toolbarActionType,
        });
        emitAction({
          type: 'SET_FRAME_TEMPLATE',
          data: frame,
        });
        handleClick && handleClick();
      },
    };
  };

  return (
    <FrameToolWrapper
      className="toolbar-item"
      aria-opended={isOpened && itemIndex === openParentIndex}
      {...genToolBarItemAttr(itemIndex, toolbarActionType, setOpenedExternal)}
    >
      <div className="item-parent has-children">
        <i className="fa fa-swatchbook item-icon" aria-hidden="true"></i>
        <span className="item-title">Khung viền</span>
      </div>
      <div
        className="item-childrens-scroll"
        onClick={e => {
          e.stopPropagation();
        }}
      >
        <Scrollbars
          autoHide
          autoHideTimeout={300}
          autoHideDuration={300}
          heightRelativeToParent="100%"
          className="list-image-content"
        >
          <div className="item-childrens">
            {isLoadingInternal ? (
              <Skeleton active paragraph={{ rows: 10 }} className="loading" />
            ) : (
              <>
                <div className="item-childrens__title">
                  Chọn và tùy chỉnh viền
                </div>
                <div className="item-childrens__content">
                  {frameTemplates.map((frame, index) => (
                    <div
                      className="item-children"
                      key={index}
                      {...genFrameItemAttr(index, frame)}
                    >
                      <img
                        alt="loading img"
                        src={genImgUrl({
                          location: frame?.thumb?.location,
                          width: FRAME_IMG_SIZE,
                          height: FRAME_IMG_SIZE,
                        })}
                      ></img>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </Scrollbars>
      </div>
    </FrameToolWrapper>
  );
});

export const FrameToolWrapper = styled.div`
  .loading {
    margin-top: -15px;
  }
  .item-childrens {
    padding: 15px 16px;
    .item-childrens__title {
      line-height: 1;
      color: ${({ theme }) => theme.text};
    }
    .item-childrens__content {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    .item-children {
      cursor: pointer;
      overflow: hidden;
      width: calc(26px + ${FRAME_IMG_SIZE}px);
      height: calc(26px + ${FRAME_IMG_SIZE}px);
      border: 2px solid transparent;
      padding: 11px;
      margin-top: 11px;
      transition: all ease-out 0.2s;
      &[aria-active='true'] {
        border-color: ${({ theme }) => theme.primary};
        border-radius: 6px;
      }
      img {
        object-fit: cover;
        width: 100%;
        height: 100%;
        background: url('${transparent}');
      }
    }
  }
`;
