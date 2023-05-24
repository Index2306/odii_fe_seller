import { Select, Button, Drawer, Pagination, Tabs, Modal } from 'antd';
import { Table } from 'app/components';
import { Swiper } from 'swiper/react';
import styled from 'styled-components/macro';
import color from 'color';

export const MainWrapper = styled.div`
  padding: ${({ theme }) => theme.space.s4 * 3}px
    ${({ theme }) => theme.space.s4 * 2}px;
  width: ${({ theme }) => `calc(999px + ${theme.space.s4 * 4}px)`};
  margin: 0 auto;

  @media screen and (min-width: 1600px) {
    width: ${({ theme }) => `calc(1257px + ${theme.space.s4 * 4}px)`};
  }
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.space.s4 * 4}px;
`;

export const CustomTable = styled(Table)`
  .ant-table-thead {
    display: none;
  }
  .ant-table-title {
    border: 0 !important;
    padding-top: 0px;
    border-bottom: 1px solid ${({ theme }) => theme.stroke};
  }
  .ant-table-row:nth-child(odd) {
    background: ${({ theme }) => theme.backgroundBlue};
  }
`;

export const Title = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.f6}px;
  font-weight: 700;
`;

export const Filter = styled.div`
  & > *:not(:last-child) {
    margin-right: ${({ theme }) => theme.space.s4}px;
  }
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
  /* .ant-select-selection-placeholder {
    &:before {
      content: '\f005';
      font-family: 'Font Awesome 5 Pro';
      font-weight: 400;
      color: ${({
    theme,
  }) => theme.primary}!important;
      margin-right: ${({ theme }) =>
    theme.space.s4 / 2}px;
    }
  }

  .ant-select-selection-item {
    color: ${({
    theme,
  }) =>
    theme.orange}!important;

    .fa-star:not(:first-child) {
      margin-right: ${({
    theme,
  }) => theme.space.s4 / 3}px;
    }

    span {
      color: ${({ theme }) =>
    theme.gray3};
      margin-left: ${({ theme }) =>
    theme.space.s4 / 2}px;
      font-weight: 400;
    }
  } */
`;

export const SortSelect = styled(CustomSelect)`
  .ant-select-selector {
    &:before {
      content: '\f888';
    }
  }
`;

export const WarehousingSelect = styled(CustomSelect)`
  .ant-select-selector {
    &:before {
      content: '\f3c5';
    }
  }
`;

export const FilterButton = styled(Button)`
  padding: ${({ theme }) => theme.space.s4 / 2}px
    ${({ theme }) => theme.space.s4}px!important;
  line-height: ${({ theme }) => theme.lineHeight}!important;
  height: auto !important;
  color: ${({ theme }) => theme.primary}!important;
  font-weight: 500;
  border-radius: ${({ theme }) => theme.radius}px;
  border: solid 1px ${({ theme }) => theme.stroke}!important;

  i {
    margin-right: ${({ theme }) => theme.space.s4 / 2}px;
  }
`;

export const ProductList = styled.div`
  display: flex;
  flex-wrap: wrap;
  /* margin: ${({ theme }) => theme.space.s4 * 4}px 0 0; */
`;

export const ProductItem = styled.div`
  width: 225px;
  background-color: ${({ theme }) => theme.whitePrimary};
  border-radius: ${({ theme }) => theme.radius}px;
  margin-bottom: 28px;
  transition: all 0.3s, margin 0s;
  position: relative;
  border: solid 1px ${({ theme }) => theme.stroke};
  margin-right: 33px;

  @media screen and (max-width: 1599px) {
    &:nth-child(4n) {
      margin-right: 0;
    }
  }

  @media screen and (min-width: 1600px) {
    &:nth-child(5n) {
      margin-right: 0;
    }
  }

  &:hover {
    box-shadow: 0px 5px 15px rgba(30, 70, 117, 0.15);
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;

    .action {
      opacity: 1 !important;
      height: 44px !important;

      button {
        transform: translateY(0px) !important;
        opacity: 1 !important;
      }
    }
  }

  .thumb {
    width: 100%;
    padding-bottom: 100%;
    position: relative;
    cursor: pointer;
    border-top-left-radius: ${({ theme }) => theme.radius}px;
    border-top-right-radius: ${({ theme }) => theme.radius}px;
    overflow: hidden;
    .promotion-sale {
      position: absolute;
      top: 0;
      right: 0;
      background: #ed0d01;
      color: #fff;
      z-index: 1;
      justify-content: center;
      display: block;
      align-items: center;
      font-size: 0.75rem;
      padding: 10px 4px 0px;
      width: 30px;
      margin-bottom: 20px;
      position: absolute;
      line-height: 16px;
      text-align: center;
    }
    .promotion-sale:after,
    .promotion-sale:before {
      position: absolute;
      bottom: -21px;
      content: '';
      width: 50%;
      display: block;
      border-style: solid;
      border-width: 22px;
      border-bottom: 0 solid;
    }
    .promotion-sale:before {
      border-left: 30px solid transparent;
      border-right: 0;
      right: 0;
      border-color: #ed0d01 #ed0d01 #ed0d01 transparent;
    }
    .promotion-sale:after {
      border-right: 30px solid transparent;
      border-left: 0;
      left: 0;
      border-color: #ed0d01 transparent #ed0d01 #ed0d01;
    }

    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: contain;
      object-position: center;
    }
  }

  .info {
    padding: ${({ theme }) => theme.space.s4}px;

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
      display: flex;
      justify-content: space-between;

      .text-item {
        font-size: 12px;
      }

      .text-right {
        text-align: left;
        align-items: center;
      }
      .price-item {
        font-weight: 500;
        font-size: 13px;
        .price-suggest {
          display: flex;
          font-weight: normal;
          align-items: center;

          .percent {
            margin-left: 4px;
            font-size: 12px;
            font-weight: normal;
            line-height: 22px;
          }
        }
      }

      .price-left {
        display: block;
        align-items: center;
      }
      .price-right {
        display: block;
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

    .warehouse {
      border-right: solid 1px ${({ theme }) => theme.stroke};
      /* padding-right: ${({ theme }) => theme.space.s4 * 1.5}px; */
      flex: 1;
      &-title {
        color: ${({ theme }) => theme.gray3};
      }

      &-info {
        align-items: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: inline-block;
        max-width: 85%;
        img {
          margin-right: ${({ theme }) => theme.space.s4 / 3}px;
        }
      }
    }

    .selected {
      padding-left: ${({ theme }) => theme.space.s4 * 1.4}px;
      &-title {
        color: ${({ theme }) => theme.gray3};
      }
      &-count {
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

export const ProductDetail = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;

  .info {
    padding: ${({ theme }) => (theme.space.s4 / 3) * 10}px;
    padding-bottom: ${({ theme }) => (theme.space.s4 / 6) * 25}px;
    border-bottom: solid 1px ${({ theme }) => theme.stroke};
    display: flex;
  }
  .name {
    font-size: ${({ theme }) => theme.fontSizes.f4}px;
    margin-bottom: ${({ theme }) => (theme.space.s4 * 5) / 6}px;
  }
  .supplier {
    color: ${({ theme }) => theme.gray3};
    margin-bottom: ${({ theme }) => theme.space.s3}px;
    &-name {
      color: ${({ theme }) => theme.darkBlue1};
      text-decoration: underline;
      margin-left: ${({ theme }) => theme.space.s4 / 1.5}px;
    }

    &-inventory {
      display: flex;
      margin-bottom: ${({ theme }) => theme.space.s4 / 0.75}px;
    }
  }

  .inventory {
    color: ${({ theme }) => theme.gray3};
    margin-bottom: ${({ theme }) => theme.space.s2}px;
    padding-right: ${({ theme }) => theme.space.s4 * 2}px;
    margin-right: ${({ theme }) => theme.space.s4 * 2}px;
    border-right: solid 1px ${({ theme }) => theme.stroke};
    &-num {
      padding-left: ${({ theme }) => theme.space.s7}px;
      color: ${({ theme }) => theme.text};
    }
  }

  .warehouse {
    margin-bottom: ${({ theme }) => theme.space.s7}px;
    color: ${({ theme }) => theme.gray3};
    &-address {
      color: ${({ theme }) => theme.text};
      margin-left: ${({ theme }) => theme.space.s4 * 1.5}px;
      .img {
        margin-right: ${({ theme }) => theme.space.s4 / 3}px;
      }
    }
  }

  .price {
    margin-top: ${({ theme }) => theme.space.s4 / 0.75}px;
    margin-bottom: ${({ theme }) => theme.space.s4 * 1.5}px;
    border-top: solid 1px ${({ theme }) => theme.stroke};
    padding-top: ${({ theme }) => (theme.space.s4 / 6) * 13}px;
    display: flex;
    align-items: center;

    &-title {
      color: ${({ theme }) => theme.gray3};
      width: ${({ theme }) => theme.space.s4 * 10}px;
      min-width: ${({ theme }) => theme.space.s4 * 10}px;
    }

    &-detail {
      font-size: ${({ theme }) => theme.fontSizes.f4}px;
      color: ${({ theme }) => theme.orange};
      font-weight: 700;
      span {
        font-size: ${({ theme }) => theme.fontSizes.f2}px;
        font-weight: 400;
      }
    }
  }

  .option {
    display: flex;
    margin-top: ${({ theme }) => theme.space.s4 / 2}px;

    &-title {
      color: ${({ theme }) => theme.gray3};
      width: ${({ theme }) => theme.space.s4 * 10}px;
      min-width: ${({ theme }) => theme.space.s4 * 10}px;
      text-transform: capitalize;
    }
    &-value {
      word-break: break-all;

      .tag {
        display: inline-block;
        padding: ${({ theme }) => theme.space.s4 / 4}px
          ${({ theme }) => theme.space.s4 / 1.5}px;
        background-color: ${({ theme }) => theme.backgroundBlue};
        border-radius: ${({ theme }) => theme.radius}px;
        border: solid 1px ${({ theme }) => theme.stroke};
        margin-bottom: ${({ theme }) => (theme.space.s4 * 5) / 6}px;
        &:not(:last-child) {
          margin-right: ${({ theme }) => (theme.space.s4 * 5) / 6}px;
        }
      }
    }
  }

  .detail {
    padding-top: ${({ theme }) => theme.space.s4 * 2}px;
    padding-left: ${({ theme }) => (theme.space.s4 / 3) * 10}px;
    padding-right: ${({ theme }) => (theme.space.s4 / 3) * 10}px;
    padding-bottom: ${({ theme }) => theme.space.s4 * 4}px;
    background-color: ${({ theme }) => theme.background};
    display: flex;
    flex: 1;

    &-item {
      &:first-child {
        margin-right: 30px;
        width: 585px;
      }
      &:not(:first-child) {
        flex: 1;
        position: sticky;
        top: 0;
      }
    }

    &-title {
      font-size: ${({ theme }) => theme.fontSizes.f4}px;
      font-weight: 700;
      margin-bottom: ${({ theme }) => theme.space.s4 * 1.5}px;
    }

    &-info {
      background-color: ${({ theme }) => theme.whitePrimary};
      border-radius: ${({ theme }) => theme.radius * 1.5}px;
      box-shadow: 0px 4px 10px rgba(30, 70, 117, 0.05);
      border: solid 1px ${({ theme }) => theme.stroke};

      img {
        max-width: 100%;
      }
    }
  }

  .report {
    &-title {
      font-size: ${({ theme }) => theme.fontSizes.f4}px;
      font-weight: 700;
      margin-bottom: ${({ theme }) => theme.space.s4 * 1.5}px;
    }

    &-info {
      padding: ${({ theme }) => theme.space.s4 * 1.5}px;
      background-color: ${({ theme }) => theme.whitePrimary};
      border-radius: ${({ theme }) => theme.radius * 1.5}px;
      border: solid 1px ${({ theme }) => theme.stroke};
      box-shadow: 0px 4px 10px rgba(30, 70, 117, 0.05);
      width: 100%;
      &-row {
        display: flex;

        &:first-child {
          border-bottom: solid 1px ${({ theme }) => theme.stroke};
          padding-bottom: ${({ theme }) => theme.space.s4 * 2}px;
          margin-bottom: ${({ theme }) => theme.space.s4 * 2}px;
        }
      }

      &-item {
        flex: 1;
        &:first-child {
          border-right: solid 1px ${({ theme }) => theme.stroke};
          padding-right: ${({ theme }) => (theme.space.s4 / 3) * 5}px;
        }
        &:last-child {
          padding-left: ${({ theme }) => (theme.space.s4 / 3) * 5}px;
        }
      }

      &-title {
        color: ${({ theme }) => theme.gray3};
        font-size: ${({ theme }) => theme.fontSizes.f1}px;
      }

      &-detail {
        font-size: ${({ theme }) => theme.fontSizes.f3}px;
        font-weight: 700;

        .fa-star {
          background: linear-gradient(93.29deg, #ffbd2a 1.65%, #fd7659 178.67%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        span {
          color: ${({ theme }) => theme.gray3};
          font-size: ${({ theme }) => theme.fontSizes.f1}px;
          font-weight: 400;
          vertical-align: ${({ theme }) => theme.space.s1}px;
        }
      }
    }
  }

  .khuyen-mai-hb {
    margin-bottom: 2px;
    margin-top: 25px;
    background: white;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ef0b0b;
    width: 100%;
  }
  .khuyen-mai-hb .tieu-de {
    background: #e31616;
    padding: 2px 20px;
    margin-top: -24px;
    font-size: 15px;
    font-weight: 500;
    color: #ffffff;
    display: block;
    max-width: 207px;
    border-radius: 99px;
  }

  .khuyen-mai-hb ul {
    margin-bottom: 4px;
    padding-left: 15px;
    padding-top: 10px;
  }

  .thumb {
    display: flex;
    margin-right: ${({ theme }) => theme.space.s4 * 2}px;
    &-default {
      height: 330px;
      width: 330px;
      margin-left: 10px;
      position: relative;

      .promotion-sale {
        position: absolute;
        top: 0;
        right: 0;
        background: #ed0d01;
        color: #fff;
        z-index: 1;
        justify-content: center;
        display: block;
        align-items: center;
        font-size: 0.75rem;
        padding: 10px 4px 0px;
        width: 30px;
        margin-bottom: 20px;
        position: absolute;
        line-height: 16px;
        text-align: center;
      }
      .promotion-sale:after,
      .promotion-sale:before {
        position: absolute;
        bottom: -21px;
        content: '';
        width: 50%;
        display: block;
        border-style: solid;
        border-width: 22px;
        border-bottom: 0 solid;
      }
      .promotion-sale:before {
        border-left: 30px solid transparent;
        border-right: 0;
        right: 0;
        border-color: #ed0d01 #ed0d01 #ed0d01 transparent;
      }
      .promotion-sale:after {
        border-right: 30px solid transparent;
        border-left: 0;
        left: 0;
        border-color: #ed0d01 transparent #ed0d01 #ed0d01;
      }

      &:hover {
        .icon-downloadImg {
          display: flex;
        }
      }

      .swiper-container {
        width: 100%;
        padding: 0;

        .swiper-slide {
          width: 100% !important;
          height: 100% !important;
        }
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        object-position: center;
      }
    }

    .icon-downloadImg {
      display: none;
      position: absolute;
      top: 20px;
      right: 20px;
      background: #fff;
      border-radius: 50%;
      width: 36px;
      height: 36px;
      justify-content: center;
      align-items: center;
      box-shadow: 0px 4px 10px rgb(0 0 0 / 10%);
      cursor: pointer;
    }
  }
  .downloading {
    position: absolute;
    bottom: 50px;
    right: 50px;
    background: #3d56a624;
    border-radius: 4px;
    width: 95px;
    height: 40px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    color: ${({ theme }) => theme.primary};
    .download-title {
      font-size: ${({ theme }) => theme.fontSizes.f1}px;
      margin-left: 7px;
    }
  }

  .ant-table-cell {
    padding-left: 23px !important;
  }
`;

export const ProductDetailModal = styled(Modal)`
  top: 50px;
  height: calc(100vh - 100px);
  overflow: hidden;
  padding-bottom: 0;

  .ant-modal {
    &-content {
      border-radius: ${({ theme }) => theme.radius * 1.5}px;
      overflow: hidden;
      height: 100%;
    }
    &-body {
      padding: 0;
      height: 100%;
      overflow: scroll;
    }
  }
  .btn-download-img {
    margin-left: 15px;
  }
`;

export const ProductDetailTabs = styled(Tabs)`
  .ant-tabs-nav {
    padding: 0 ${({ theme }) => theme.space.s4 * 2}px;
  }

  .ant-tabs-ink-bar {
    display: none;
  }

  .ant-tabs-tab .ant-tabs-tab-btn {
    font-weight: 700;
    color: ${({ theme }) => theme.grayBlue};
  }

  .ant-tabs-tab-active .ant-tabs-tab-btn {
    color: ${({ theme }) => theme.primary};
  }
`;

export const ProductDetailDesc = styled.div`
  padding: 0 ${({ theme }) => theme.space.s4 * 2}px;
`;

export const ProductDetailThumb = styled(Swiper)`
  width: 60px;
  height: 330px;
  padding: 22px 0;

  .next,
  .prev {
    position: absolute;
    left: 0;
    width: 100%;
    background-color: ${({ theme }) => theme.whitePrimary};
    z-index: 1;
    text-align: center;
    cursor: pointer;
  }

  .next {
    bottom: 0;
    box-shadow: 0px -5px 10px rgb(0 0 0 / 27%);
  }
  .prev {
    top: 0;
    box-shadow: 0px 5px 10px rgb(0 0 0 / 27%);
  }

  .swiper-slide {
    width: 60px;
    height: 60px !important;

    &:first-child {
      margin-top: 10px;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      object-position: center;
    }
  }
`;

// export const ProductDetailThumbItem = styled(SwiperSlide)`
//   width: 40px;
//   height: 40px;

//   img {
//     width: 100%;
//     height: 100%;
//     object-fit: contain;
//     object-position: center;
//   }
// `;

export const FilterDrawer = styled(Drawer)`
  .ant-drawer-content-wrapper {
    width: 270px !important;
  }

  .ant-drawer-body {
    padding-bottom: 90px;
  }

  .drawer {
    &-title {
      font-weight: 700;
      font-size: ${({ theme }) => theme.fontSizes.f3}px;
      color: ${({ theme }) => theme.primary};
    }
  }
`;

export const DrawerItem = styled.div`
  margin-top: ${({ theme }) => (theme.space.s4 / 3) * 5}px;
  &:not(:first-child) {
    border-bottom: 1px dashed #e2e2e2;
  }
  .drawer {
    &-item-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 700;
      margin-bottom: ${({ theme }) => (theme.space.s4 / 3) * 5}px;

      i {
        color: ${({ theme }) => theme.gray3};
      }
    }

    &-item-body {
      margin-bottom: ${({ theme }) => (theme.space.s4 / 3) * 5}px;
    }

    &-item-rating {
      .ant-radio-wrapper {
        display: block;
        margin-bottom: ${({ theme }) => theme.space.s4}px;
        color: ${({ theme }) => theme.orange};

        i:not(:first-child) {
          margin-left: ${({ theme }) => theme.space.s4 / 2}px;

          & + span {
            margin-left: ${({ theme }) => theme.space.s4}px;
            color: ${({ theme }) => theme.text};
          }
        }
      }
    }
  }

  .ant-checkbox-wrapper {
    display: flex;
    margin-left: 0;
    &:not(:last-child) {
      margin-bottom: ${({ theme }) => theme.space.s4}px;
    }
  }
`;

export const DrawerButtonGroup = styled.div`
  display: flex;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: ${({ theme }) => theme.whitePrimary};
  padding: ${({ theme }) => theme.space.s4 * 2}px;
  border-top: solid 1px ${({ theme }) => theme.stroke};
  button {
    flex: 1;
    &:first-child {
      margin-right: ${({ theme }) => theme.space.s4}px;
    }
  }
`;

export const WrapperOption = styled.div`
  .ant-list-item-meta {
    align-items: center;
  }
  .ant-image {
    width: 45px;
    border-radius: 4px;
  }
`;

export const WrapperTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  > * {
    color: ${({ theme }) => theme.grayBlue};
    background: #f2f2f2;
    &.active {
      color: ${({ theme }) => theme.whitePrimary};
      background: ${({ theme }) => theme.primary};
    }
  }
`;
