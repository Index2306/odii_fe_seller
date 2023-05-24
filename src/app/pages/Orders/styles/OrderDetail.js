import { Row } from 'antd';
import styled from 'styled-components/macro';
import { SectionWrapper } from 'styles/commons';
import { PageWrapper } from 'app/components';

function wrapBasic(wrapper) {
  return styled(wrapper)`
    .px-default {
      padding-left: 22px;
      padding-right: 22px;
    }
    .box-df {
      box-shadow: 0px 4px 10px rgba(30, 70, 117, 0.05);
    }
    .font-df {
      font-size: 14px;
    }
    .font-xs {
      font-size: 12px;
    }
    .font-sm {
      font-size: 16px;
    }
    .font-md {
      font-size: 18px;
    }
    .font-lg {
      font-size: 20px;
    }
    .border-df {
      border: 1px solid #ebebf0;
    }
    .br-df {
      border-radius: 4px;
    }
    .section-title {
      font-weight: bold;
      font-size: 18px;
    }
    .value-empty {
      color: #ccc !important;
    }
    .lh-1 {
      line-height: 1;
    }
    .mt-4 {
      margin-top: 4px !important;
    }
  `;
}

export const PageWrapperDefault = styled(wrapBasic(PageWrapper))`
  width: 1200px;
  .page-detail-title {
    margin-bottom: 16px;
    font-weight: bold;
  }
  .page-action {
    display: flex;
    justify-content: end;
  }
`;

export const GeneralStatisticWrapper = styled(Row)`
  display: flex;
  .status-payment {
    padding: 0;
    width: auto;
    position: absolute;
    top: 17px;
    right: 20px;
  }
  .statistic-item {
    display: flex;
    border: 1px solid #ebebf0;
    position: relative;
  }
  & > :last-child .item-info__value {
    color: #65a1c3;
  }
  .statistic-item__icon {
    display: inline-flex;
    width: 50px;
    height: 50px;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
  }
  .statistic-item__info {
    margin-left: 12px;
    .item-info__title {
      color: ${({ theme }) => theme.gray3};
    }
  }
  .item-info__value {
    font-weight: 900;
    line-height: 1;
    margin-top: 4px;
    letter-spacing: 0.02em;
    .info-value__unit {
      font-size: 14px;
    }
  }
`;

export const ListOrderItemWrapper = styled(SectionWrapper)`
  padding: ${({ loading }) => (loading ? null : 0)};
  .top-title {
    display: flex;
    justify-content: space-between;
    height: 60px;
    align-items: center;
    .status-fulfill {
      padding: 0;
      width: auto;
    }
    .top-title__right {
      color: ${({ theme }) => theme.gray3};
      & > span:nth-child(2) {
        font-style: italic;
      }
    }
  }
  .content-items {
    border-left: 0;
    border-right: 0;
    border-bottom: 0;
    .order-thumbnail {
      width: 40px;
      height: 40px;
      object-fit: cover;
      border-radius: 4px;
      border: 1px solid #f0efef;
      flex-grow: 1;
      flex-shrink: 0;
    }
  }
  .order-item-tbl {
    width: 100%;
  }
  .order-item-remove {
    background: #f4f6fd;
    color: #6c798f;
    border: 1px solid #ececec;
    width: 19px;
    height: 19px;
    font-size: 12px;
    border-radius: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
  .order-item-tbl thead tr td {
    padding-top: 19px;
    padding-bottom: 11px;
    border-bottom: 1px solid #ebebf0;
    color: ${({ theme }) => theme.grayBlue};
    font-weight: 500;
  }
  .order-item-tbl tbody tr td {
    padding-top: 17px;
    padding-bottom: 17px;
  }
  .order-item-tbl tbody tr:hover {
    background: #f7f7f9;
  }
  .order-item-tbl tr td {
    padding-left: 12px;
  }
  .order-item-tbl tr td:first-child {
    padding-left: 22px;
  }
  .order-item-tbl tr td:last-child {
    padding-right: 5px;
  }
  .order-item-tbl tr td:nth-child(2),
  .order-item-tbl tr td:nth-child(3),
  .order-item-tbl tr td:nth-child(4) {
    text-align: right;
  }
  .order-item-tbl tr td:nth-child(5) {
    text-align: right;
    padding-right: 0;
    padding-left: 30px;
  }
  .order-item-tbl thead tr td:first-child {
    width: 320px;
  }
  .create-tbl thead tr td:first-child {
    width: 240px;
  }
  .order-item-tbl tbody tr td:first-child > div {
    display: flex;
    align-items: center;
    .order-info-text {
      display: flex;
      line-height: 1.5;
      flex-direction: column;
      margin-left: 15px;
      letter-spacing: 0.02rem;
      span:first-child {
        color: ${({ theme }) => theme.darkBlue1};
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: break-all;
      }
      span:nth-child(2),
      span:nth-child(3) {
        font-size: 12px;
        color: ${({ theme }) => theme.gray3};
        margin-top: 1px;
      }
    }
  }

  //update
  .list-order-wrapper {
    padding: 21px 20px;
    padding: 21px 0;
  }
  .list-order__top.flex-row {
    display: flex;
    align-items: center;
    line-height: 1;
    padding: 0 20px;
    .list-order-top__plus {
      margin-left: auto;
      font-weight: 500;
      color: #3d56a6;
      i {
        font-weight: normal;
      }
      span {
        margin-left: 5px;
      }
    }
  }
  .create-tbl.order-item-tbl tr {
    & > td:first-child {
      padding-left: 20px;
      min-width: 260px;
    }
    & > td:last-child {
      width: 42px;
    }
  }
  .product-search-wrapper {
    margin: 22px 0 20px 0;
    padding: 0 20px;
    .product-search {
      position: relative;
      flex-grow: 1;
      flex-shrink: 0;
      .product-search__input {
        padding-left: 32px;
        height: 40px;
        /* letter-spacing: 0.01em; */
        &::placeholder {
          color: #6c798f;
        }
      }
      .ant-form-item-control-input-content {
        position: relative;
        &:before {
          position: absolute;
          z-index: 1;
          content: '\f002';
          color: #7c8db5;
          font-family: 'Font Awesome 5 Pro';
          top: 0;
          left: 0;
          height: 100%;
          padding: 0 12px;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #7c8db5;
        }
      }
    }
    .btn-search {
      height: 40px;
      margin-left: 10px;
    }
  }
  .quantity-input {
    outline: none !important;
    border: 1px solid #ebebf0;
    box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.05);
    border-radius: 4px;
    height: 32px;
    width: 77px;
    padding: 0 10px;
  }
  .empty-page-wrapper {
    padding: 40px 0 24px 0;
    .style-1 > div {
      .img {
        width: 74px;
      }
    }
  }
`;

export const PaymentInfoWrapper = styled(SectionWrapper)`
  .status-payment {
    padding: 0;
    width: auto;
    font-size: 12px;
    margin-left: 8px;
    padding-left: 10px;
    position: relative;
  }
  .payment-type {
    color: ${({ theme }) => theme.gray3};
    margin-left: 8px;
    padding-left: 10px;
    position: relative;
  }
  .status-payment:after,
  .payment-type:after {
    content: '';
    position: absolute;
    top: 1px;
    left: 0;
    height: calc(100% - 2px);
    width: 1px;
    background: #ebebf0;
  }
  .content-top__item,
  .content-bottom__item {
    display: flex;
    justify-content: space-between;
    padding-top: 11px;
  }
  .create-order .content-top__item {
    padding-top: 14px;
  }
  .content-top__item:last-child {
    padding-bottom: 15px;
    font-weight: bold;
  }
  .content-top__item:last-child > span:nth-child(2) {
    color: #f2994a;
  }
  .content-top_link {
    text-decoration: underline;
    color: #2f80ed;
  }
  .payment-content__bottom {
    position: relative;
    padding-top: 5px;
    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: -20px;
      right: -20px;
      border-top: 1px solid #ebebf0;
    }
    .status-select {
      width: 100%;
      .ant-select-selector,
      .ant-select-selection-search-input {
        height: 36px;
        display: flex;
        align-items: center;
      }
      .ant-select-selection-placeholder,
      .ant-select-arrow {
        color: #7c8db5;
      }
      .ant-select-arrow {
        font-size: 11px;
      }
      .ant-select-selector {
        border: 1px solid #ebebf0;
        box-sizing: border-box;
        box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.05);
        border-radius: 4px;
      }
      .ant-select-selection-item {
        display: flex;
        align-items: center;
      }
    }
    &.update-bottom {
      display: flex;
      padding-top: 19px;
      align-items: center;
      flex-direction: row;
      .status-select {
        width: 160px;
        margin-left: auto;
      }

      .help-text {
        color: #e52020;
        font-weight: 500;
        max-width: 450px;
      }
    }
  }
`;

export const OrderCodeWrapper = styled(SectionWrapper)`
  .order-top__name {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 5px 0 10px 0;
  }
  .order-code__value {
    color: #f2994a;
    font-size: 18px;
    font-weight: bold;
    letter-spacing: 0.4em;
    border: none;
    outline: none;
    width: 100%;
  }
  .copy-icon {
    cursor: pointer;
  }
  .order-code__center {
    .center-item {
      padding: 17px 0 0;
      position: relative;
      &:before {
        content: '';
        position: absolute;
        top: 0;
        left: -20px;
        right: -20px;
        border-top: 1px solid #ebebf0;
      }
      & > div {
        display: flex;
        justify-content: space-between;
        padding-bottom: 7px;
        & > div:first-child {
          color: ${({ theme }) => theme.gray3};
        }
      }
      & > div:last-child {
        padding-bottom: 0;
      }
      .center-item__icon {
        margin-right: 9px;
        width: 15px;
      }
    }
  }
`;

export const CustomerInfoWrapper = styled(SectionWrapper)`
  .customer-top__name {
    margin-top: 2px;
    color: ${({ theme }) => theme.darkBlue1};
  }
  .customer-info__top.flex-row {
    display: flex;
    align-items: center;
    line-height: 1;
    .customer-top__plus {
      cursor: pointer;
      margin-left: auto;
      font-weight: 500;
      color: #3d56a6;
      i {
        font-weight: normal;
      }
      span {
        margin-left: 5px;
      }
    }
  }
  .customer-top__search {
    position: relative;
    margin: 18px 0 20px 0;
    .customer-search--input {
      padding-left: 32px;
      height: 36px;
      /* letter-spacing: 0.01em; */
      &::placeholder {
        color: #7c8db5;
      }
    }
    .ant-select:before {
      position: absolute;
      z-index: 1;
      content: '\f002';
      color: #7c8db5;
      font-family: 'Font Awesome 5 Pro';
      top: 0;
      left: 0;
      height: 100%;
      padding: 0 12px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #7c8db5;
    }
  }
  .customer-info__center {
    margin-top: 10px;
    .info-title {
      word-break: keep-all;
      padding-right: 5px;
    }
    .center-item__one {
      display: flex;
      position: relative;
      &:before {
        content: '';
        position: absolute;
        top: 0;
        left: -20px;
        right: -20px;
        border-top: 1px solid #ebebf0;
      }
      & > div {
        width: 50%;
        padding: 13px 0;
      }
      & > div:first-child {
        border-right: 1px solid #ebebf0;
      }
      & > div:last-child {
        padding-left: 20px;
      }
      & > div > div:first-child {
        color: ${({ theme }) => theme.gray3};
      }
      & > div > div:last-child {
        font-weight: 900;
        font-size: 18px;
      }
    }
    .center-item__two {
      padding-top: 11px;
      padding-bottom: 10px;
      position: relative;
      &:before {
        content: '';
        position: absolute;
        top: 0;
        left: -20px;
        right: -20px;
        border-top: 1px solid #ebebf0;
      }
      .customer-mail__value {
        color: ${({ theme }) => theme.darkBlue1};
      }
      & > div {
        display: flex;
        justify-content: space-between;
        padding-bottom: 8px;
        & > div:first-child {
          color: ${({ theme }) => theme.gray3};
          white-space: nowrap;
          word-break: keep-all;
          margin-right: 10px;
        }
      }
    }
  }
  .customer-info__bottom {
    position: relative;
    padding-top: 25px;
    padding-bottom: 10px;
    .customer-bottom__title {
      display: flex;
      align-items: center;
      line-height: 1;
      padding-bottom: 5px;
    }
    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: -20px;
      right: -20px;
      border-top: 1px solid #ebebf0;
    }
    .shipping-address__plus {
      cursor: pointer;
      margin-left: auto;
      font-weight: 400;
      font-size: 14px;
      /* color: #3d56a6; */
      color: ${({ theme }) => theme.darkBlue1};
      text-decoration: underline;
    }
    .address-plus {
      margin-top: 13px;
      height: 40px;
      border-style: dashed;
      box-sizing: border-box;
      box-shadow: 0px 4px 10px rgba(30, 70, 117, 0.05);
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 4px;
      font-size: 14px;
      color: #4f5a73;
      color: #828282;
      color: #bbb;
      /* font-weight: 500; */
      /* i {
        font-weight: normal;
      } */
    }
    .shipping-note {
      margin-top: 18px;
    }
    .shipping-note__title {
      font-weight: bold;
    }
    .shipping-note__content {
      margin-top: 11px;
    }
    .shipping-note__input {
      box-sizing: border-box;
      border-radius: 4px;
      height: 40px;
      width: 100%;
      padding: 11px 12px;
    }
  }
  .customer-bottom__content {
    .bottom-content__item {
      margin-top: 10px;
      & > div:first-child {
        font-weight: 700;
      }
      & > div:last-child {
        margin-top: 3px;
        color: ${({ theme }) => theme.gray3};
      }
    }
  }

  //create
  .customer-select {
    width: 100%;
    position: relative;
    .ant-select-selection-item {
      .customer-avatar,
      .customer-email {
        display: none;
      }
      .customer-text {
        margin-left: 0 !important;
      }
      .customer-name {
        height: 36px;
        display: flex;
        align-items: center;
      }
    }
  }
  .customer-select .ant-select-selector {
    border-radius: 4px !important;
    height: 36px;
    padding-left: 32px;
    .ant-select-selection-item {
      margin: -2px 0;
    }
    .ant-select-selection-search-input {
      height: 36px !important;
      padding-left: 22px;
    }
    .ant-select-selection-placeholder {
      line-height: 36px;
      color: #7c8db5;
    }
  }
  .create-customer {
    margin-bottom: -20px;
  }
  .customer-name-wrapper {
    margin-top: 18px;
    margin-bottom: -10px;
    display: flex;
    .btn-update-customer {
      /* position: absolute; */
      /* top: 0;
      height: 36px;
      right: 0; */
      /* padding: 0 7px; */
      /* display: inline-flex; */

      /* align-items: center; */
      cursor: pointer;
      color: #2f80ed;
      text-decoration: underline;
      margin-left: auto;
      padding-left: 5px;
      word-break: keep-all;
      text-align: right;
      /* border: 1px solid #2f80ed; */
      top: 6px;
      height: 23px;
      right: 6px;
      border-radius: 4px;
      background: #fff;
    }
  }
`;

export const StoreInfoWrapper = styled(SectionWrapper)`
  .store-info__top {
    display: flex;
    justify-content: space-between;
    &.create {
      flex-direction: column;
    }
    .store-platform-wrapper {
      margin-top: 13px;
    }
    .store-platform {
      display: flex;
      align-items: center;
    }
    .store-platform-select {
      width: 100%;
      .ant-select-selector,
      .ant-select-selection-search-input {
        height: 36px;
        display: flex;
        align-items: center;
      }
      .ant-select-selection-placeholder,
      .ant-select-arrow {
        color: #7c8db5;
      }
      .ant-select-arrow {
        font-size: 11px;
      }
      .ant-select-selector {
        border: 1px solid #ebebf0;
        box-sizing: border-box;
        box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.05);
        border-radius: 4px;
      }
      .ant-select-selection-item {
        display: flex;
        align-items: center;
      }
    }
    .store-platform__icon {
      height: 12px;
      width: auto;
    }
    .store-platform__name {
      margin-left: 6px;
      color: ${({ theme }) => theme.primary};
    }
  }
  .store-info_content {
    display: flex;
    align-items: center;
    border: 1px solid #ebebf0;
    border-radius: 4px;
    padding: 8px 11px;
    margin-top: 12px;
    min-height: 40px;
    .store-icon {
      border-radius: 100%;
      flex-grow: 1;
      flex-shrink: 0;
    }
    .store-name {
      margin-left: 5px;
      line-height: 1.3;
    }
  }
  .ant-select-selection-overflow {
    height: 100%;
    align-content: space-around;
  }
`;

export const WarehousingInfoWrapper = styled(SectionWrapper)`
  .warehousing-info__content {
    display: flex;
    align-items: center;
    border: 1px solid #ebebf0;
    background: #f7f7f9;
    border-radius: 4px;
    padding: 8px 11px;
    margin-top: 12px;
    min-height: 40px;
    .warehousing-icon {
      border-radius: 100%;
      flex-grow: 1;
      flex-shrink: 0;
    }
    .warehousing-name {
      margin-left: 5px;
      line-height: 1.3;
    }
  }
  .warehousing-info__bottom {
    .bottom-content__item {
      margin-top: 10px;
      & > div:first-child {
        font-weight: 700;
      }
      & > div:last-child {
        margin-top: 3px;
        color: ${({ theme }) => theme.gray3};
      }
    }
  }
`;

export const OrderHistoryWrapper = styled(SectionWrapper)`
  .order-note {
    display: flex;
    margin-top: 12px;
    .ant-form-item {
      margin-bottom: 0;
      flex-grow: 1;
    }
    .ant-form-item-explain.ant-form-item-explain-error {
      min-height: unset;
      padding-top: 5px;
    }
  }
  .order-note__input {
    height: 40px;
    &.ant-input-affix-wrapper:focus {
      box-shadow: none;
    }
    .ant-input::placeholder {
      color: #bdbdbd;
    }
  }
  .order-note__btn {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 11px;
    width: 73px;
    height: 40px;
    flex-shrink: 0;
    background: ${({ theme }) => theme.darkBlue3};
    border-radius: 4px;
    color: #fff;
    border: none;
    .note-btn__title {
    }
    .note-submit-icon {
      margin-left: 7px;
    }
  }
  .order-timeline {
    margin-top: 30px;
    letter-spacing: 0.02rem;
    .ant-timeline-item {
      padding-bottom: 12px;
    }
    .ant-timeline-item-head {
      color: #6fcf97;
      border-color: #6fcf97;
      background: #6fcf97;
      width: 20px;
      height: 20px;
      border: 4px solid #fff;
    }
    .ant-timeline-item-tail {
      left: 10px;
      border-left: 1px solid #6fcf97;
    }
    .ant-timeline-item-content {
      margin-left: 34px;
      p {
        margin-bottom: 2px;
      }
      .timeline__desc {
        font-size: 12px;
        padding-bottom: 10px;
        color: ${({ theme }) => theme.gray3};
        border-bottom: 1px dashed #ebebf0;
      }
    }
    .ant-timeline-item:first-child .ant-timeline-item-head {
      border-color: #e4fcee;
    }
    .fulfillment-status {
      padding: 0;
      width: unset;
      &:before {
        display: none;
      }
    }
  }
`;

export const ShipmentInfoWrapper = styled(SectionWrapper)`
  .shipment-info__top {
    .shipment-platform-wrapper {
      margin-top: 13px;

      .ant-radio-group {
        width: 100%;
      }

      .ant-radio-wrapper:not(:last-child) {
        margin-bottom: 10px;
      }

      .ant-radio-wrapper:hover {
        color: #6c798f;
      }

      img {
        border-radius: 50%;
        width: 40px;
        height: 40px;
        margin-right: 10px;
      }

      .text {
        font-weight: bold;
        font-size: 15px;
        text-transform: capitalize;
      }

      .text-warning {
        color: #f26522;
        margin-left: 50px;
        font-weight: bold;
        line-height: 20px;
        margin-top: -10px;
      }

      .text-radio {
        font-weight: 400;
        font-size: 14px;
      }

      .text-money {
        font-weight: bold;
        font-size: 14px;
      }
    }
  }
`;
