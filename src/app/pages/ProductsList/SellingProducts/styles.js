import styled from 'styled-components/macro';
import { Dropdown, Menu, Modal as AntdModal, Select, Pagination } from 'antd';
import color from 'color';
const { Item: MenuItem } = Menu;

export const Wrapper = styled.div`
  padding-top: ${({ theme }) => theme.space.s4 * 2.5}px;
`;
const CustomSelect = styled(Select)`
  min-width: 150px;

  .ant-select-selection-search-input {
    height: 100% !important;
  }

  .ant-select-selector {
    padding: ${({ theme }) => theme.space.s4 / 2}px
      ${({ theme }) => theme.space.s4}px!important;
    border-radius: ${({ theme }) => theme.radius}px!important;
    height: auto !important;
    border: solid 1px ${({ theme }) => theme.stroke}!important;

    &:after {
      line-height: ${({ theme }) => theme.lineHeight}!important;
    }

    &:before {
      font-family: 'Font Awesome 5 Pro';
      font-weight: 400;
      color: ${({ theme }) => theme.primary}!important;
      margin-right: ${({ theme }) => theme.space.s4 / 2}px;
    }
  }

  .ant-select-selection-placeholder,
  .ant-select-selection-item {
    color: ${({ theme }) => theme.primary}!important;
    font-weight: 500;
    line-height: ${({ theme }) => theme.lineHeight}!important;
  }
`;
export const MainWrapper = styled.div`
  @media screen and (min-width: 1600px) {
    width: ${({ theme }) => `calc(1480px + ${theme.space.s4 * 4}px)`};
    margin: 0 auto;
  }
`;
export const Filter = styled.div`
  & > *:not(:last-child) {
    margin-right: ${({ theme }) => theme.space.s4}px;
  }
`;
export const Title = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.f6}px;
  font-weight: 700;
`;
export const WarehousingSelect = styled(CustomSelect)`
  .ant-select-selector {
    &:before {
      content: '\f3c5';
    }
  }
`;
export const Header = {
  Wrapper: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${({ theme }) => theme.space.s4 * 2}px;
  `,
  Title: styled.div`
    font-size: ${({ theme }) => theme.fontSizes.f6}px;
    font-weight: 700;
  `,
  Button: styled.div``,
  Icon: styled.div``,
  Text: styled.div`
    margin-left: 5px;
    height: 100%;
    display: flex;
    align-items: center;
  `,
};

export const Body = styled.div``;

export const List = styled.div``;

export const Item = {
  Wrapper: styled.div`
    padding: ${({ theme }) => theme.space.s4 * 1.5}px
      ${({ theme }) => theme.space.s4 * 2}px;
    background-color: ${({ theme }) => theme.whitePrimary};
    border: solid 1px ${({ theme }) => theme.stroke};
    border-radius: ${({ theme }) => theme.radius * 1.5}px;
    display: flex;
    align-items: center;
    margin-bottom: 25px;
    height: 86px;

    &:hover {
      box-shadow: 0 8px 60px 0 rgba(103, 151, 255, 0.11),
        0 12px 90px 0 rgba(103, 151, 255, 0.11);
    }
  `,
  Thumb: styled.div`
    width: 45px;
    height: 45px;
    border-radius: 50%;
    /* background-color: ${({ theme }) => theme.stroke}; */
    margin-right: 10px;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      object-position: center;
    }

    i {
      color: ${({ theme }) => theme.gray3};
      font-size: ${({ theme }) => theme.fontSizes.f3}px;
    }
  `,
  Info: {
    Wrapper: styled.div`
      flex: 1;
    `,
    Title: styled.div`
      a {
        color: inherit;
        &:hover {
          color: ${({ theme }) => theme.primary};
        }
      }
      font-weight: 600;
      margin-bottom: ${({ theme }) => theme.space.s0}px;
    `,
    Email: styled.div`
      font-size: ${({ theme }) => theme.fontSizes.f1}px;
      color: ${({ theme }) => theme.grayBlue};
    `,
  },
  Status: styled.div`
    color: ${props => (props.active ? '#50BF4E' : '#EB5757')};
    padding: 0 30px;
    border-right: solid 1px ${({ theme }) => theme.stroke};
    line-height: 45px;

    &:before {
      content: '';
      display: inline-block;
      width: ${({ theme }) => theme.space.s4 / 2}px;
      height: ${({ theme }) => theme.space.s4 / 2}px;
      background-color: ${props => (props.active ? '#50BF4E' : '#EB5757')};
      border-radius: 50%;
      margin-right: ${({ theme }) => theme.space.s4 / 2}px;
      vertical-align: middle;
    }
  `,
  Platform: styled.div`
    padding: 5px 30px;
    text-transform: capitalize;
    height: 100%;

    span {
      display: block;
      width: 93px;
      padding: ${({ theme }) => theme.space.s4 / 2}px 0;
      border: solid 1px ${({ theme }) => theme.stroke};
      border-radius: ${({ theme }) => theme.radius}px;
      box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.05);
      text-align: center;
      font-weight: 400;
      font-size: 14px;
      line-height: 18px;

      img {
        max-width: 14px;
        max-height: 14px;
        vertical-align: middle;
        margin-top: -1px;
        margin-right: ${({ theme }) => theme.space.s4 / 2}px;
      }
    }
  `,
  Detail: {
    Wrapper: styled.div`
      display: flex;
    `,
    Item: {
      Wrapper: styled.div`
        &:not(:last-child) {
          padding-right: 20px;
        }
        &:not(:first-child) {
          padding-left: 20px;
          border-left: 1px solid rgb(235, 235, 240);
        }
      `,
      Title: styled.div`
        font-size: ${({ theme }) => theme.fontSizes.f1}px;
        color: ${({ theme }) => theme.grayBlue};
        margin-bottom: ${({ theme }) => theme.space.s4 / 1.5}px;
        font-weight: 400;
        line-height: 14px;
      `,
      Number: styled.div`
        font-weight: 700;
        color: ${({ theme }) => theme.primary};
      `,
    },
  },
  Action: {
    Wrapper: styled.div`
      margin-left: 16px;
    `,
    Dropdown: styled(Dropdown)`
      cursor: pointer;
    `,
    Menu: styled(Menu)`
      border-radius: ${({ theme }) => theme.radius}px;
      box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.2);
    `,
    MenuItem: styled(MenuItem)`
      color: ${({ theme }) => theme.primary};
      &:last-child {
        color: ${({ theme }) => theme.redPrimary};
      }

      i {
        width: ${({ theme }) => theme.space.s4 * 2}px;
        height: ${({ theme }) => theme.space.s4 * 2}px;
        line-height: ${({ theme }) => theme.space.s4 * 2}px;
        text-align: center;
        margin-right: ${({ theme }) => theme.space.s4 / 2}px;
      }
    `,
  },
  Event: styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    cursor: pointer;
  `,
};

export const Modal = {
  Wrapper: styled(AntdModal)`
    text-align: center;
    padding-bottom: 0;

    .ant-modal-body {
      padding: 31px 32px 43px;
    }
  `,
  Title: styled.div`
    font-size: 30px;
    color: ${({ theme }) => theme.primary};
    font-weight: 700;
    line-height: 35px;
  `,
  Desc: styled.div`
    color: #333333;
    margin: 4px 0 19px;
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
    text-align: center;
    letter-spacing: 0.03em;
  `,
  PlatForm: {
    List: styled.div`
      display: flex;
      justify-content: center;
    `,
    Item: styled.div`
      cursor: pointer;
      &:not(:last-child) {
        margin-right: 35px;
      }
    `,
    Icon: styled.div`
      width: 90px;
      height: 90px;
      border-radius: ${({ theme }) => theme.radius * 1.5}px;
      border: solid 1px ${({ theme }) => theme.stroke};
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: ${props =>
        props.active ? props.theme.whitePrimary : props.theme.stroke};
      img {
        max-width: 45px;
      }

      &:hover {
        background-color: rgb(235, 235, 240);
      }
    `,
    Name: styled.div`
      margin-top: 9px;
      font-weight: 400;
      font-size: 14px;
      line-height: 16px;
      text-align: center;
      color: #6c798f;
    `,
  },
};
export const ProductItem = styled.div`
  width: 250px;
  background-color: ${({ theme }) => theme.whitePrimary};
  border-radius: ${({ theme }) => theme.radius}px;
  margin-bottom: 28px;
  transition: all 0.3s, margin 0s;
  position: relative;
  border: solid 1px ${({ theme }) => theme.stroke};
  margin-right: 29px;

  @media screen and (max-width: 1599px) {
    &:nth-child(4n) {
      margin-right: 0;
    }
  }

  @media screen and (min-width: 1600px) {
    & {
      width: 280px;
    }
    &:nth-child(5n) {
      margin-right: 0;
    }
  }

  &:hover {
    box-shadow: 0px 5px 15px rgba(30, 70, 117, 0.15);
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;

    /* .action {
      opacity: 1 !important;
      height: 44px !important;

      button {
        transform: translateY(0px) !important;
        opacity: 1 !important;
      }
    } */
  }

  .thumb {
    width: 100%;
    padding-bottom: 100%;
    position: relative;
    cursor: pointer;
    border-top-left-radius: ${({ theme }) => theme.radius}px;
    border-top-right-radius: ${({ theme }) => theme.radius}px;
    overflow: hidden;

    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: contain;
      object-position: center;
    }

    .ant-image {
      position: unset;
      display: block;
    }
  }

  .info {
    padding: 0 ${({ theme }) => theme.space.s4}px 14px;
    height: 165px;

    .box-custom {
      padding: 4px 0 0 !important;
    }

    .name {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1; /* number of lines to show */
      -webkit-box-orient: vertical;
      /* min-height: ${({ theme }) =>
        theme.space.s4 * theme.lineHeight * 2}px; */
      /* max-height: ${({ theme }) =>
        theme.space.s4 * theme.lineHeight * 2}px; */
      cursor: pointer;

      &:hover {
        color: ${({ theme }) => color(theme.text).darken(0.5)};
      }
    }

    .supplier {
      display: flex;
      margin-bottom: ${({ theme }) => theme.space.s4}px;
      font-size: ${({ theme }) => theme.fontSizes.f1}px;
      a {
        color: ${({ theme }) => theme.text};
        &:hover {
          color: ${({ theme }) => theme.primary};
        }
      }
    }

    .price {
      margin-bottom: ${({ theme }) => theme.space.s4}px;
      margin-bottom: 10px;

      .text-right {
        text-align: right;
      }

      .text-item {
        font-size: 12px;
      }

      .price-item {
        font-weight: 500;
        margin-left: 5px;

        .price-suggest {
          display: flex;
          font-weight: normal;
          font-size: 13px;

          .percent {
            margin-left: 5px;
            font-size: 12px;
            font-weight: normal;
            line-height: 22px;
          }
        }
      }

      .price-left {
        display: flex;
        align-items: center;
      }
      .price-right {
        display: flex;
        align-items: center;
      }
    }

    .rating {
      margin-bottom: ${({ theme }) => theme.space.s4}px;

      .fa-star {
        &.active {
          background: linear-gradient(93.29deg, #ffbd2a 1.65%, #fd7659 178.67%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        &:not(.active) {
          color: #e0e0e0;
        }
      }

      .fa-star-half-alt {
        color: ${({ theme }) => theme.grayBlue};
        margin-right: ${({ theme }) => theme.space.s4 / 4}px;

        & + span {
          color: ${({ theme }) => theme.grayBlue};
          font-size: ${({ theme }) => theme.fontSizes.f1}px;
          font-style: italic;
        }
      }

      .vote-count {
        margin-left: ${({ theme }) => theme.space.s4 / 2}px;
        color: ${({ theme }) => theme.gray3};
      }
    }

    .more {
      display: flex;
      font-size: ${({ theme }) => theme.fontSizes.f1}px;
    }

    .variant {
      border-right: solid 1px ${({ theme }) => theme.stroke};
      /* padding-right: ${({ theme }) => theme.space.s4 * 1.5}px; */
      flex: 1;
      &-title {
        color: ${({ theme }) => theme.gray3};
      }

      &-info {
        display: flex;
        align-items: center;

        img {
          margin-right: ${({ theme }) => theme.space.s4 / 3}px;
        }
      }
    }

    .quantity {
      flex: 1;
      &-title {
        color: ${({ theme }) => theme.gray3};
      }

      .quantity-title {
        text-align: right;
      }
    }

    .action {
      position: absolute;
      width: 100%;
      top: 100%;
      left: 0;
      border-bottom-left-radius: ${({ theme }) => theme.radius}px;
      border-bottom-right-radius: ${({ theme }) => theme.radius}px;
      padding: ${({ theme }) => theme.space.s4}px;
      padding-top: 0;
      background-color: ${({ theme }) => theme.whitePrimary};
      box-shadow: 0px 15px 15px rgba(30, 70, 117, 0.15);
      opacity: 0;
      transition: visibility 0s, opacity 0.2s linear;
      z-index: 999;
      height: 0px;
      overflow: hidden;
      transition: height 0.3s ease-out 0s;

      button {
        width: 100%;
        opacity: 0;
        height: 30px;
        transform: translateY(-10px);
        transition: all 0.3s ease-out 0s;
      }
    }
  }
  .flex-col {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
`;
export const ProductList = styled.div`
  display: flex;
  flex-wrap: wrap;
  /* margin: ${({ theme }) => theme.space.s4 * 4}px 0 0; */
`;
export const ProductPagination = styled(Pagination)`
  padding: ${({ theme }) => theme.space.s4}px;
  background-color: ${({ theme }) => theme.whitePrimary};
  display: flex;

  .ant-pagination-total-text {
    font-weight: 500;
    height: auto;
    flex: 1;
  }

  .ant-pagination-item,
  .ant-pagination-prev,
  .ant-pagination-next {
    border: solid 1px ${({ theme }) => theme.stroke};
    color: ${({ theme }) => theme.grayBlue};

    a {
      color: ${({ theme }) => theme.grayBlue};
    }
  }

  .ant-pagination-item-active {
    background-color: ${({ theme }) => theme.primary};
    border-color: ${({ theme }) => theme.primary};

    a {
      color: ${({ theme }) => theme.whitePrimary};
    }
  }
`;
export const SortSelect = styled(CustomSelect)`
  .ant-select-selector {
    &:before {
      content: '\f888';
    }
  }
`;
export const RatingSelectOption = styled.div`
  color: ${({ theme }) => theme.orange} !important;
  i:not(:last-child) {
    margin-right: ${({ theme }) => theme.space.s4 / 3}px;
  }
  span {
    color: ${({ theme }) => theme.gray3};
    margin-right: ${({ theme }) => theme.space.s4 / 2}px;
  }
`;
export const RatingSelect = styled(CustomSelect)`
  min-width: 200px !important;
  .ant-select-selector {
    height: 36px !important;
  }
`;
export const PageWrapper = styled.div`
  padding: 0 105px;
  box-sizing: content-box;
  max-width: 1600px;
`;
