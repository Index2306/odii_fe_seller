import React, { useState, useRef, useEffect, memo } from 'react';
import { Upload, message, Skeleton } from 'antd';

import { uploadImage } from 'utils/request';
import request from 'utils/request';

import styled from 'styled-components/macro';
import { genImgUrl } from 'utils/helpers';

import { Scrollbars } from 'react-custom-scrollbars';
import { Button } from 'app/components';

const IMG_FIT_SIZE = 105;
const IMG_MAX_SIZE = 227;

// const SAMPLE_FILE = [
//   { id: 1, location: 'eb9d72f3038148b69a1a19df25ac3963-anh1_old1.png' },
//   { id: 2, location: 'b1e55f56753941f38cbd7c6b9e8d3edc-anh2_old1.png' },
//   { id: 3, location: '8d24769719b944ecb97ee06aa7364da6-anh2_old1.png' },
//   { id: 4, location: 'ebea7d44bb0b4f29b23237b6e87c15c2-anh_4_old1.png' },
// ];

const SAMPLE_IMAGE_TYPE = 'SAMPLE_IMAGE_TYPE';
const PERSONAL_IMAGE_TYPE = 'PERSONAL_IMAGE_TYPE';

const IMAGE_BASE_URL = 'common-service/img-editor';
const IMAGE_UPLOAD_PATH = '/upload-image';
const IMAGE_SAMPLE_PATH = '/sample-image';
const IMAGE_PERSONAL_PATH = '/personal-image';

export default memo(function ImageTool({
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
  const imageTypeTabs = [
    {
      title: 'Mẫu có sẵn',
      key: SAMPLE_IMAGE_TYPE,
      onClick: () => {
        changeTab(SAMPLE_IMAGE_TYPE);
      },
    },
    {
      title: 'Đã tải lên',
      key: PERSONAL_IMAGE_TYPE,
      onClick: () => {
        changeTab(PERSONAL_IMAGE_TYPE);
      },
    },
  ];

  const [isLoadingInternal, setLoadingInternal] = useState(false);
  const [selectedChildrenId, setSelectedChildrenId] = useState(-1);
  const [isOpened, setOpened] = useState(false);
  const [isOpenedAgo, setIsOpenedAgo] = useState(false);
  const [currTabkey, setCurrTabkey] = useState(imageTypeTabs[0].key);
  const [tabDatas, setTabDatas] = useState(
    imageTypeTabs.map(tab => ({ key: tab.key, isLoadAgo: false, images: [] })),
  );

  const isReadOnlyImages = currTabkey === SAMPLE_IMAGE_TYPE;

  const setOpenedExternal = ({ isForce, state }) => {
    setOpened(isForce ? state : !isOpened);
  };

  useEffect(() => {
    isOpened && setIsOpenedAgo(true);
  }, [isOpened]);

  useEffect(() => {
    if (isOpenedAgo) {
      fetchData(currTabkey);
    }
  }, [isOpenedAgo]);

  useEffect(() => {
    if (currToolAction !== toolbarActionType) {
      setSelectedChildrenId(-1);
    }
  }, [currToolAction]);

  const getCurrImages = () => {
    return tabDatas
      .find(tabData => tabData.key === currTabkey)
      .images.sort((a, b) => b.id - a.id);
  };

  const changeTab = tabKey => {
    if (currTabkey === tabKey) {
      return;
    }
    setSelectedChildrenId(-1);
    setCurrTabkey(tabKey);
    fetchData(tabKey);
  };

  const fetchData = async (tabKey, isForceUpdate) => {
    const currTabIndex = imageTypeTabs.findIndex(tab => tab.key === tabKey);
    if (!isForceUpdate && tabDatas[currTabIndex].isLoadAgo) {
      return;
    }

    let requestUrl;
    switch (tabKey) {
      case SAMPLE_IMAGE_TYPE:
        requestUrl = IMAGE_BASE_URL + IMAGE_SAMPLE_PATH;
        break;
      case PERSONAL_IMAGE_TYPE:
        requestUrl = IMAGE_BASE_URL + IMAGE_PERSONAL_PATH;
        break;
      default:
        break;
    }
    if (!requestUrl) {
      return;
    }
    setLoadingInternal(true);
    const { is_success, data } = await request(requestUrl);
    if (is_success) {
      const tabDataClones = [...tabDatas];
      tabDataClones[currTabIndex] = {
        ...tabDataClones[currTabIndex],
        images: data,
        isLoadAgo: true,
      };
      setTabDatas(tabDataClones);
    }
    setLoadingInternal(false);
  };

  const chooseImage = image => {
    setSelectedChildrenId(image.id);
    emitAction({
      type: 'UPDATE_TOOL_ACTION',
      data: toolbarActionType,
    });
    emitAction({
      type: 'ADD_IMAGE',
      data: image,
    });
  };

  const deleteImage = async image => {
    setLoading(true);
    const requestUrl = IMAGE_BASE_URL + IMAGE_PERSONAL_PATH + '/' + image.id;
    const { is_success } = await request(requestUrl, {
      method: 'delete',
    });
    if (is_success) {
      await fetchData(currTabkey, true);
    }
    setLoading(false);
  };

  const genImageItemAttr = (image, handleClick) => {
    const isCurrChildrenSeleted = selectedChildrenId === image.id;
    if (isCurrChildrenSeleted) {
      return {
        'aria-active': true,
      };
    }

    return {
      'aria-active': false,
      // onClick: () => {
      //   setSelectedChildrenId(image.id);
      //   emitAction({
      //     type: 'UPDATE_TOOL_ACTION',
      //     data: toolbarActionType,
      //   });
      //   emitAction({
      //     type: 'ADD_IMAGE',
      //     data: image,
      //   });
      //   handleClick && handleClick();
      // },
    };
  };

  function beforeUpload(file) {
    const fileExtValids = ['image/jpeg', 'image/png'];
    const maxSizeInMb = 5;

    if (!fileExtValids.includes(file.type)) {
      message.error(
        `You can only upload [ ${fileExtValids.join(', ')} ] file!`,
      );
      return false;
    }
    if (file.size / 1024 / 1024 > maxSizeInMb) {
      message.error(`Image must smaller than ${maxSizeInMb}MB!`);
      return false;
    }
    return true;
  }

  const dummyRequest = ({ file, onSuccess }) => {
    setLoading(true);
    uploadImage(file, IMAGE_BASE_URL + IMAGE_UPLOAD_PATH)
      .then(result => {
        setLoading(true);
        onSuccess(result?.data);
      })
      .catch(err => {
        setLoading(false);
      });
  };

  const handleChangeFile = async (info, type) => {
    if (info.file.status === 'uploading') {
      //   isLoading = true;
      return;
    }
    if (info.file.status === 'error') {
    }
    if (info.file.status === 'done') {
      const file = info.file.response;
      setSelectedChildrenId(file.id);
      await fetchData(currTabkey, true);
      emitAction({
        type: 'UPDATE_TOOL_ACTION',
        data: toolbarActionType,
      });
      emitAction({
        type: 'ADD_IMAGE',
        data: file,
      });
    }
  };

  return (
    <FrameToolWrapper
      className="toolbar-item"
      aria-opended={isOpened && itemIndex === openParentIndex}
      {...genToolBarItemAttr(itemIndex, toolbarActionType, setOpenedExternal)}
      {...props}
    >
      <div className="item-parent has-children">
        <i className="fa fa-image item-icon" aria-hidden="true"></i>
        <span className="item-title">Thêm ảnh</span>
      </div>
      <div
        className="item-childrens-scroll"
        onClick={e => {
          e.stopPropagation();
        }}
      >
        <div className="item-childrens">
          <>
            <div className="item-childrens__title">
              <div className="tabs-title">
                {imageTypeTabs.map(tab => (
                  <div
                    className="tab-title"
                    aria-active={tab.key === currTabkey}
                    onClick={tab.onClick}
                  >
                    {tab.title}
                  </div>
                ))}
              </div>
              {currTabkey === PERSONAL_IMAGE_TYPE && (
                <Upload
                  customRequest={dummyRequest}
                  beforeUpload={beforeUpload}
                  showUploadList={false}
                  onChange={file => handleChangeFile(file)}
                  className="upload-wrapper"
                >
                  <div className="btn-upload">
                    <i className="fa fa-upload"></i>
                    <span>Tải lên</span>
                  </div>
                </Upload>
              )}
            </div>
            <Scrollbars
              autoHide
              autoHideTimeout={300}
              autoHideDuration={300}
              heightRelativeToParent="100%"
              className="list-image-content"
            >
              {isLoadingInternal ? (
                <Skeleton
                  active
                  paragraph={{ rows: 10 }}
                  className="skeleton-loading"
                />
              ) : (
                <>
                  {currTabkey === PERSONAL_IMAGE_TYPE &&
                    getCurrImages().length === 0 && (
                      <div className="upload-empty-note">
                        <div className="images-icon-wrapper">
                          <i className="images-icon fa fa-images"></i>
                        </div>
                        <div className="upload-empty__desc">
                          <div>
                            Tải lên hình ảnh bạn muốn <br />
                            chèn vào hình sản phẩm.
                          </div>
                          <div>
                            Định dạng JPG, PNG...,
                            <br />
                            kích thước dưới 5MB.
                          </div>
                        </div>
                      </div>
                    )}
                  <div className="item-childrens__content">
                    {getCurrImages().map(image => (
                      <div
                        className="item-children"
                        key={image.id}
                        {...genImageItemAttr(image)}
                      >
                        <img
                          alt="loading img"
                          src={genImgUrl({
                            location: image?.location,
                            width: IMG_MAX_SIZE,
                            height: IMG_MAX_SIZE,
                            fitType: 'fit-in',
                          })}
                        ></img>
                        <div
                          className="image-action-wrapper"
                          data-readonly={isReadOnlyImages}
                        >
                          {!isReadOnlyImages && (
                            <Button
                              context="secondary"
                              color="orange"
                              className="image-action delete-action"
                              onClick={() => {
                                deleteImage(image);
                              }}
                            >
                              Xóa
                              {/* <i className="fa fa-trash"></i> */}
                            </Button>
                          )}
                          <Button
                            color="blue"
                            context="secondary"
                            className="image-action choose-action"
                            onClick={() => {
                              chooseImage(image);
                            }}
                          >
                            Chọn
                            {/* <i className="fas fa-check"></i> */}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </Scrollbars>
          </>
        </div>
      </div>
    </FrameToolWrapper>
  );
});

export const FrameToolWrapper = styled.div`
  .loading {
    margin-top: -15px;
  }
  .item-childrens {
    padding: 16px 0;
    height: calc(100% - 91px);
    .item-childrens__title {
      line-height: 1;
    }
    .item-childrens__title,
    .item-childrens__content,
    .upload-empty-note,
    .skeleton-loading {
      padding: 0 16px;
    }
    .tabs-title {
      display: flex;
      .tab-title {
        display: flex;
        width: 50%;
        justify-content: center;
        align-items: center;
        height: 40px;
        font-size: 12px;
        font-weight: 500;
        background: #f7f7f9;
        color: ${({ theme }) => theme.grayBlue};
        cursor: pointer;
        border: 1px solid #ebebf0;
        border-right: none;
        &[aria-active='true'] {
          background: #ffffff;
          color: ${({ theme }) => theme.primary};
        }
        :first-child {
          border-top-left-radius: 4px;
          border-bottom-left-radius: 4px;
        }
        :last-child {
          border-right: 1px solid #ebebf0;
          border-top-right-radius: 4px;
          border-bottom-right-radius: 4px;
        }
      }
    }
    .upload-wrapper {
      display: block;
      margin-top: 15px;
      .ant-upload.ant-upload-select {
        display: block;
      }
      .btn-upload {
        border: 1px solid #ebebf0;
        box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.05);
        border-radius: 4px;
        height: 36px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: ${({ theme }) => theme.primary};
        cursor: pointer;
        & > span {
          margin-left: 10px;
        }
      }
    }
    .upload-empty-note {
      margin-top: 37px;
      text-align: center;
      .images-icon {
        font-size: 26px;
        color: ${({ theme }) => theme.grayBlue};
      }
      .upload-empty__desc {
        color: #4f4f4f;
        margin-top: 9px;
      }
    }
    .item-childrens__content {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      margin-top: -1px;
    }
    .item-children {
      display: flex;
      position: relative;
      justify-content: center;
      align-items: center;
      width: ${IMG_FIT_SIZE}px;
      height: ${IMG_FIT_SIZE}px;
      border: 1px solid #ebebf0;
      border-radius: 4px;
      padding: 9px;
      margin-top: 19px;
      transition: all ease-out 0.2s;
      &[aria-active='true'] {
        border-color: ${({ theme }) => theme.primary};
        border-radius: 6px;
      }
      img {
        object-fit: cover;
        max-width: 100%;
        max-height: 100%;
      }
      &:hover .image-action-wrapper {
        opacity: 1;
      }
      .image-action-wrapper {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        display: flex;
        opacity: 0;
        transition: all ease-out 0.25s;
        justify-content: center;
        align-items: center;
        background: #02020263;
        border-radius: 4px;
        &[data-readonly='true'] {
          .image-action {
            width: 80px;
          }
        }
        .image-action {
          height: 30px;
          width: 43px;
          padding: 0;
          box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.25);
          border-color: transparent;
          transition: all ease-out 0.25s;
          :not(:first-child) {
            margin-left: 5px;
          }
          &.delete-action {
            &:hover {
              background-color: #eb5757;
            }
          }
          &.choose-action {
            background: #fff;
          }
          &:hover {
            background: ${({ theme }) => theme.primary};
          }
        }
      }
    }
  }
`;
