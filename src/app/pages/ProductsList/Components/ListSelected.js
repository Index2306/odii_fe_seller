import React, { memo } from 'react';
import { Image } from 'app/components';
import { isEmpty } from 'lodash';
import styled from 'styled-components';
import { Spin } from 'antd';
import { CustomStyle } from 'styles/commons';
import { CustomSectionWrapper } from './styled';

export default memo(function ListSelected({
  listData = [],
  listUpdateDetail = [],
  setCurrent,
  current,
}) {
  const handleSetCurrent = data => () => {
    setCurrent(data);
  };
  return (
    <CustomSectionWrapper pt={{ xs: 's5' }} px={{ xs: 0 }} mt={{ xs: 's4' }}>
      <CustomStyle pl={{ xs: 's5' }} className="title">
        Chọn sản phẩm chỉnh sửa
      </CustomStyle>
      <WrapperList>
        {isEmpty(current) ||
          listData?.map((item, index) => (
            <Spin
              tip="Đang tải..."
              key={item.id}
              spinning={listUpdateDetail[index]?.status === 'loading'}
            >
              <div
                className={item.id === current.id ? 'item active' : 'item'}
                onClick={handleSetCurrent(item)}
              >
                <div className="avatar">
                  <Image
                    size="200x200"
                    src={item?.thumb?.location}
                    // onClick={handlePickImage(index)}
                  />
                </div>
                <div className="content">
                  <div className="title-item">{item?.name}</div>
                </div>
              </div>
            </Spin>
          ))}
      </WrapperList>
    </CustomSectionWrapper>
  );
});

const WrapperList = styled.div`
  /* display: flex; */
  .item {
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 16px 17px;
    &.active {
      background: ${({ theme }) => theme.backgroundBlue};
    }
  }
  .avatar {
    display: flex;
    margin-right: 8px;
    .ant-image {
      width: 45px;
      border-radius: 4px;
    }
    .ant-image-img {
      border-radius: 4px;
    }
  }
  .content {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: flex;
    align-items: center;
  }
`;
