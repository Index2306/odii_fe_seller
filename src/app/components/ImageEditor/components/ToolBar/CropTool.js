import React, { useState, useRef, useEffect, memo, useCallBack } from 'react';

import styled from 'styled-components/macro';
import { TOOL_ACTION_CROP_BACKGROUND, TOOL_ACTION_DESIGN_LAYER } from '../..';

export default memo(function CropTool({
  emitAction,
  setLoading,
  itemIndex,
  openParentIndex,
  currToolAction,
  genToolBarItemAttr,
  toolbarActionType,
  ...props
}) {
  const [selectedChildrenIndex, setSelectedChildrenIndex] = useState(-1);
  const [isOpened, setOpened] = useState(false);

  useEffect(() => {
    if (currToolAction !== toolbarActionType) {
      setSelectedChildrenIndex(-1);
    }
  }, [currToolAction]);

  const setOpenedExternal = ({ isForce, state }) => {
    setOpened(isForce ? state : !isOpened);
  };

  const genCropItemAttr = (index, handleClick) => {
    const isCurrChildrenSeleted = selectedChildrenIndex === index;
    if (isCurrChildrenSeleted) {
      return {
        'aria-active': true,
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
        handleClick && handleClick();
      },
    };
  };

  return (
    <CropToolWrapper
      className="toolbar-item"
      aria-opended={isOpened && itemIndex === openParentIndex}
      {...genToolBarItemAttr(itemIndex, toolbarActionType, setOpenedExternal)}
    >
      <div className="item-parent has-children">
        <i className="fa fa-crop item-icon"></i>
        <span className="item-title">Crop - Cắt ảnh</span>
      </div>
      <div className="item-childrens-scroll">
        <div
          className="item-childrens"
          onClick={e => {
            e.stopPropagation();
          }}
        >
          <div
            className="item-children"
            {...genCropItemAttr(0, () => {
              emitAction({ type: 'ADD_CROP_BOX' });
            })}
          >
            <div className="crop-icon-wrapper default-icon-wrapper">
              <div className="crop-icon">
                <svg
                  width="28"
                  height="35"
                  viewBox="0 0 28 35"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0)">
                    <path
                      d="M24.0202 3.53125C24.1662 3.93401 25.7878 8.72714 22.462 14.3794C20.4418 17.8125 17.3747 18.0396 17.0743 18.0537C16.8984 17.8075 15.1668 15.2424 16.5735 11.5105C18.8898 5.36632 23.6169 3.66641 24.0202 3.53125Z"
                      fill="#F5F8FF"
                    />
                    <path
                      d="M24.0064 3.53125L16.8784 18.0537C17.1867 18.0396 20.3342 17.8125 22.4073 14.3794C25.8204 8.72714 24.1562 3.93401 24.0064 3.53125Z"
                      fill="#728BCE"
                    />
                    <path
                      d="M4.62694 3.53125C4.48095 3.93401 2.85931 8.72714 6.18516 14.3794C8.20527 17.8125 11.2724 18.0396 11.5728 18.0537C11.7487 17.8075 13.4803 15.2424 12.0735 11.5105C9.75737 5.36632 5.03018 3.66641 4.62694 3.53125Z"
                      fill="#F5F8FF"
                    />
                    <path
                      d="M12.0961 11.5237C9.87523 5.36936 5.34247 3.66664 4.95581 3.53125C8.8942 11.4622 11.0185 16.5422 11.6322 18.0537C11.8686 17.6975 13.4103 15.1654 12.0961 11.5237Z"
                      fill="#7088C9"
                    />
                    <path
                      d="M14.3234 0.96875C13.8554 1.44339 8.44582 7.17259 9.30617 17.5811C9.8287 23.9032 13.9175 26.3669 14.3234 26.5966C14.7292 26.3669 18.818 23.9032 19.3406 17.5811C20.2009 7.17259 14.7913 1.44339 14.3234 0.96875Z"
                      fill="#F5F8FF"
                    />
                    <path
                      d="M14.3235 0.96875V26.5966C14.7293 26.3669 18.8182 23.9032 19.3407 17.5811C20.201 7.17259 14.7915 1.44339 14.3235 0.96875Z"
                      fill="#7088C9"
                    />
                    <path
                      d="M26.3409 16.6952C27.3971 12.9716 27.0396 9.51074 27.0396 9.51074C27.0396 9.51074 25.0057 10.4402 19.8943 13.8285C15.9212 16.4623 14.6919 21.0801 14.3235 22.3247H18.993C22.3872 22.3247 25.3927 20.0385 26.3409 16.6952Z"
                      fill="#F5F8FF"
                    />
                    <path
                      d="M27.0396 9.51074C27.0396 9.51074 21.7865 20.1563 14.3235 22.3247H18.993C22.3873 22.3247 25.3926 20.0385 26.341 16.6952C27.397 12.9716 27.0396 9.51074 27.0396 9.51074Z"
                      fill="#728BCE"
                    />
                    <path
                      d="M2.30598 16.6952C1.24984 12.9716 1.60733 9.51074 1.60733 9.51074C1.60733 9.51074 3.64124 10.4402 8.7526 13.8285C12.7257 16.4623 13.955 21.0801 14.3234 22.3247H9.65395C6.25968 22.3247 3.25427 20.0385 2.30598 16.6952Z"
                      fill="#F5F8FF"
                    />
                    <path
                      d="M14.3234 22.3247C13.9533 21.0801 12.7184 16.4623 8.72711 13.8285C3.59229 10.4402 1.54907 9.51074 1.54907 9.51074C1.54907 9.51074 6.82625 20.1563 14.3234 22.3247Z"
                      fill="#7088C9"
                    />
                    <path
                      d="M17.7145 33.4306H10.9322C9.13327 33.4306 7.59012 32.1202 7.26121 30.3133L5.80713 22.3252H22.8396L21.3855 30.3133C21.0566 32.1202 19.5134 33.4306 17.7145 33.4306Z"
                      fill="#F5F8FF"
                    />
                    <path
                      d="M19.5075 22.3253L18.0367 30.3134C17.7041 32.1202 16.1431 33.4306 14.3235 33.4306H17.6557C19.4753 33.4306 21.0362 32.1202 21.3689 30.3133L22.8397 22.3252H19.5075V22.3253Z"
                      fill="#7088C9"
                    />
                    <path
                      d="M23.2352 24.0335H5.41174C4.68952 24.0335 4.104 23.4598 4.104 22.7521C4.104 22.0444 4.68952 21.4707 5.41174 21.4707H23.2352C23.9575 21.4707 24.543 22.0444 24.543 22.7521C24.5429 23.4598 23.9575 24.0335 23.2352 24.0335Z"
                      fill="#7088C9"
                    />
                    <path
                      d="M23.2339 21.4707H21.1365V24.0335H23.2339C23.9569 24.0335 24.543 23.4598 24.543 22.7521C24.543 22.0444 23.9569 21.4707 23.2339 21.4707Z"
                      fill="#7088C9"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0">
                      <rect
                        width="26.4479"
                        height="33.4078"
                        fill="white"
                        transform="translate(0.83252 0.84375)"
                      />
                    </clipPath>
                  </defs>
                </svg>
              </div>
            </div>
            <div className="crop-name">Tỉ lệ gốc</div>
          </div>
          <div
            className="item-children"
            {...genCropItemAttr(1, () => {
              emitAction({ type: 'ADD_CROP_BOX', data: 1 });
            })}
          >
            <div className="crop-icon-wrapper rate-11-icon-wrapper">
              <div className="crop-icon crop-icon-outer">
                <div className="crop-icon-inner"></div>
              </div>
            </div>
            <div className="crop-name">1:1</div>
          </div>
          <div
            className="item-children"
            {...genCropItemAttr(2, () => {
              emitAction({ type: 'ADD_CROP_BOX', data: 4 / 3 });
            })}
          >
            <div className="crop-icon-wrapper rate-43-icon-wrapper">
              <div className="crop-icon crop-icon-outer">
                <div className="crop-icon-inner"></div>
              </div>
            </div>
            <div className="crop-name">4:3</div>
          </div>
          <div
            className="item-children"
            {...genCropItemAttr(3, () => {
              emitAction({ type: 'ADD_CROP_BOX', data: 3 / 4 });
            })}
          >
            <div className="crop-icon-wrapper rate-34-icon-wrapper">
              <div className="crop-icon crop-icon-outer">
                <div className="crop-icon-inner"></div>
              </div>
            </div>
            <div className="crop-name">3:4</div>
          </div>
          <div
            className="item-children"
            {...genCropItemAttr(4, () => {
              emitAction({ type: 'ADD_CROP_BOX', data: 3 / 2 });
            })}
          >
            <div className="crop-icon-wrapper rate-32-icon-wrapper">
              <div className="crop-icon crop-icon-outer">
                <div className="crop-icon-inner"></div>
              </div>
            </div>
            <div className="crop-name">3:2</div>
          </div>
          <div
            className="item-children"
            {...genCropItemAttr(5, () => {
              emitAction({ type: 'ADD_CROP_BOX', data: 2 / 3 });
            })}
          >
            <div className="crop-icon-wrapper rate-23-icon-wrapper">
              <div className="crop-icon crop-icon-outer">
                <div className="crop-icon-inner"></div>
              </div>
            </div>
            <div className="crop-name">2:3</div>
          </div>
        </div>
      </div>
    </CropToolWrapper>
  );
});

export const CropToolWrapper = styled.div`
  .item-childrens {
    margin-top: -20px;
    padding: 16px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  .item-children {
    margin-top: 25px;
    cursor: pointer;
  }
  .item-children[aria-active='true'] {
    .crop-icon-wrapper {
      border: 2px solid ${({ theme }) => theme.primary};
    }
    .crop-name {
      color: ${({ theme }) => theme.primary};
      font-weight: 500;
    }
  }
  .crop-icon-wrapper {
    border: 1px solid #ebebf0;
    width: 104px;
    height: 80px;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .crop-icon-wrapper .crop-icon {
    border: 1px solid #3d56a6;
    background: #e1e6f7;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .crop-icon-wrapper.default-icon-wrapper .crop-icon {
    width: 50px;
    height: 41px;
  }
  .crop-name {
    margin-top: 8px;
    /* font-size: 12px; */
  }
  .crop-icon-outer,
  .crop-icon-inner {
    position: relative;
    &:before,
    &:after {
      content: '';
      position: absolute;
      width: 7px;
      height: 7px;
      border-radius: 100%;
      background: ${({ theme }) => theme.primary};
    }
  }
  .crop-icon-outer {
    &:before {
      top: 0;
      left: 0;
      transform: translateX(-50%) translateY(-50%);
    }
    &:after {
      top: 0;
      right: 0;
      transform: translateX(50%) translateY(-50%);
    }
  }
  .crop-icon-inner {
    &:before {
      bottom: 0;
      left: 0;
      transform: translateX(-50%) translateY(50%);
    }
    &:after {
      bottom: 0;
      right: 0;
      transform: translateX(50%) translateY(50%);
    }
  }
  .rate-11-icon-wrapper .crop-icon-inner {
    width: 41px;
    height: 41px;
  }
  .rate-43-icon-wrapper .crop-icon-inner {
    width: 60px;
    height: 45px;
  }
  .rate-34-icon-wrapper .crop-icon-inner {
    width: 45px;
    height: 60px;
  }
  .rate-32-icon-wrapper .crop-icon-inner {
    width: 60px;
    height: 40px;
  }
  .rate-23-icon-wrapper .crop-icon-inner {
    width: 40px;
    height: 60px;
  }
`;
