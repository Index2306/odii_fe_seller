import styled from 'styled-components';
import { SectionWrapper } from 'styles/commons';
import Color from 'color';
import { StyleConstants } from 'styles/StyleConstants';
import { PageWrapper } from 'app/components';

export const ListProduct = styled.div`
  margin-left: 23px;
  > * {
    :hover {
      background: ${({ theme }) => theme.backgroundBlue};
      border-radius: 6px;
    }
  }
  .add-image {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 45px;
    height: 45px;
    border-radius: 4px;
    color: ${({ theme }) => theme.grayBlue};
    background-color: ${({ theme }) => theme.backgroundBlue};
    border: 1px dashed #d9dbe2;
  }
  .ant-image,
  .ant-image-img {
    width: 45px;
    border-radius: 4px;
  }
  .ant-list-item-meta-title {
    overflow: hidden;
    font-weight: 400;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
    :hover {
      color: ${({ theme }) => theme.darkBlue1};
      text-decoration: underline;
    }
  }
  .ant-list-item-meta-description {
    font-weight: 400;
    font-size: 12;
    color: rgba(0, 0, 0, 0.4);
  }
`;
export const ChartContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  border: 1px solid #cccccc;
  background: white;
  height: 100%;
  width: 100%;
  padding: 39px 15px 24px 15px;
`;

export const ChartWrapper = styled.div`
  overflow: hidden;
  overflow-x: scroll;
  width: 100%;
  overflow-y: scroll;
  height: ${props => props.height || '310px'};
  .scroll-item {
    width: 100%;
    min-width: ${props => props.scrollItemWidth}px;
    height: 100%;
  }
`;
export const CustomSectionWrapper = styled(SectionWrapper)`
  border: none;
  margin-bottom: 35px;
  .title {
    font-weight: 500;
    font-size: 18px;
  }

  .tooltip {
    margin-left: 6px;
    margin-bottom: 6px;
    cursor: pointer;
  }
`;

export const WrapOrder = styled.div`
  display: flex;

  .ant-col:not(:last-child) & {
    margin-right: 34px;
    border-right: 1px solid ${({ theme }) => theme.stroke};
  }
  .number {
    line-height: 25px;
    font-size: 22px;
    margin-right: 6px;
    font-weight: 900;
  }
  .box {
    height: 18px;
    color: ${({ colorBox }) => colorBox || '#27AE60'};
    padding: 2px 4px;
    font-size: 12px;
    border-radius: 10px;
    background-color: ${({ colorBox }) =>
      Color(colorBox || '#27AE60').alpha(0.1)};
  }
`;

export const CustomPageWrapper = styled(PageWrapper)`
  width: ${StyleConstants.bodyWidth}px;
`;

export const Banner = styled.div`
  color: #fff;
  padding-left: 56px;
  display: flex;
  height: 120px;
  justify-content: center;
  flex-direction: column;
  margin-bottom: 35px;
  background-image: url('https://i.odii.xyz/0x200/90804354752d49c6a7591e7025a74aaf-bannerdai.png');
  background-size: cover;
  background-color: transparent;
`;

export const CustomSectionWrapper2 = styled(SectionWrapper)`
  padding: 0px;
  margin-bottom: 35px;
  background: none;
  border: none;
  .title {
    font-weight: 500;
    font-size: 18px;
    margin-bottom: 18px;
  }
  .viewMore {
    color: #5b86e5;
    line-height: 22px;
  }
  .list-video {
    justify-content: space-between;
    align-items: center;
    .item-video {
      padding: 17px 15px;
      background: #ffffff;
      border: 1px solid #ebebf0;
      box-sizing: border-box;
      border-radius: 4px;
      .iframe {
        border-radius: 3px;
        margin-bottom: 16px;
      }
    }
  }
  .containerSection {
    display: flex;
    flex: 1;
    flex-direction: column;
    background: #ffffff;
    border-radius: 4px;
    padding: 29px 25px 0;
  }

  .itemNews {
    display: flex;
    margin-bottom: 20px;
    .time {
      display: flex;
      color: ${({ theme }) => theme.gray3};
      font-size: 12px;
      .read {
        position: relative;
        padding-left: 14px;
        ::before {
          content: ' ';
          left: 0;
          top: 50%;
          position: absolute;
          transform: translate(0, -50%);
          width: 5px;
          border-radius: 10px;
          height: 5px;
          background: #e0e0e0;
        }
      }
    }
  }
`;
