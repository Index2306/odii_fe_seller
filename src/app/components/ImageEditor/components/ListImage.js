import React, { useState, useRef, useEffect, memo } from 'react';

import { Scrollbars } from 'react-custom-scrollbars';

import { genImgUrl } from 'utils/helpers';
import styled from 'styled-components/macro';

export const LIST_IMAGE_CONTENT_ELEMENT_ID = '$list-image-element-image-editor';

export default memo(function ListImage({
  images,
  setImageScrollbar,
  selectedImage,
  setSelectedImage,
  ...props
}) {
  const scrollbarRef = useRef(null);

  useEffect(() => {
    if (scrollbarRef && scrollbarRef.current) {
      setImageScrollbar(scrollbarRef.current);
    }
  }, [scrollbarRef]);

  const genSwiperSlideAttr = image => {
    const isCurrSelectedImage = selectedImage?.id === image?.id;
    return {
      'aria-active': isCurrSelectedImage ? true : false,
      onClick: () => {
        if (!isCurrSelectedImage) {
          setSelectedImage(image);
        }
      },
    };
  };
  return (
    <ListImageWrapper {...props}>
      <div className="list-image-wrapper">
        <div className="list-image-title">Tất cả ảnh</div>
        <Scrollbars
          id={LIST_IMAGE_CONTENT_ELEMENT_ID}
          ref={scrollbarRef}
          autoHide
          autoHideTimeout={200}
          autoHideDuration={300}
          className="list-image-content"
        >
          {images.length > 0 && (
            <div className="images-items">
              {images.map(image => (
                <div
                  className="image-item"
                  key={image.id}
                  {...genSwiperSlideAttr(image)}
                >
                  <img
                    src={genImgUrl({
                      width: 300,
                      height: 300,
                      location: image.location,
                    })}
                    alt=""
                  />
                </div>
              ))}
            </div>
          )}
        </Scrollbars>
      </div>
    </ListImageWrapper>
  );
});

export const ListImageWrapper = styled.div`
  /* padding: 0 14px; */
  border-left: 1px solid #ebebf0;
  width: 100px;
  .list-image-wrapper {
    height: calc(100% - 20px);
  }
  .list-image-content {
    margin-top: 12px;
    height: calc(100% - 35px) !important;
    /* overflow: auto; */
  }
  .list-image-title {
    font-weight: 500;
    margin-top: 20px;
    line-height: 1;
    text-align: center;
  }
  .images-items {
    width: 72px;
    height: 100%;
    .image-item {
      cursor: pointer;
      transition: border ease-out 0.2s;
      width: 72px;
      margin: 0 14px 0 14px;
      height: 72px !important;
      border-radius: 6px;
      border: 1px solid #e4e4e4;
      &[aria-active='true'] {
        border: 2px solid #f2994a;
        box-shadow: 3px 4px 7px #a8a8a8c4;
      }
      &:not(:first-child) {
        margin-top: 15px;
      }
      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        object-position: center;
        border-radius: 6px;
      }
    }
  }
`;
