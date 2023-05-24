import { createGlobalStyle } from 'styled-components';
import { StyleConstants } from './StyleConstants';
/* istanbul ignore next */
export const GlobalStyle = createGlobalStyle`
  html,
  body {
    height: 100%;
    width: 100%;
  }

  ::-webkit-scrollbar{
    width: 6px;
    height: 6px;
    background-color: #fff;
  }
  ::-webkit-scrollbar-track {
    background-color: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background-color: rgba(115, 183, 242, 0.3);
    border-radius: 5px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #3999ec;
    cursor: pointer;
  }

  body {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    /* padding-top: ${StyleConstants.headerHeight}; */
    /* background-color: ${p => p.theme.background}; */
    color: ${p => p.theme.text};
  }

  body.fontLoaded {
    font-family: 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }
  .fa,
  .far,
  .fas {
    font-family: 'Font Awesome 5 Pro';
  }
  .far {
    font-weight: 400;
  }
  .fa,
  .fab,
  .fad,
  .fal,
  .far,
  .fas {
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    display: inline-block;
    font-style: normal;
    font-feature-settings: normal;
    font-variant: normal;
    text-rendering: auto;
    line-height: 1;
  }
  p,
  label {
    line-height: 1.5em;
  }

  input, select, button {
    font-family: inherit;
    font-size: inherit;
  }

  .text-white {
    color: #fff !important;
  }
  .text-primary {
    color: ${p => p.theme.primary} !important;
  }
  .text-secondary {
    color: ${p => p.theme.textSecondary} !important;
  }
  .text-blue1 {
    color: ${p => p.theme.darkBlue1} !important;
  }

  .text-center {
    text-align: center !important;
  }

  .icon {
    width: 1.5rem;
    height: 1.5rem;
  }

  .pointer {
    cursor: pointer !important;
  }

  /* .m-0 {
    margin: 0 !important;
  } */
  .w-100 {
    width: 100% !important;
  }
  .h-100 {
    height: 100% !important;
  }
  .invisible {
    visibility: hidden;
  }
  .grecaptcha-badge { 
    visibility: hidden;
  }

  .popover-notify--global {
    top: 64px !important;
    position: fixed;
    padding-top: 0px !important;
    .ant-popover-arrow {
       visibility: hidden;
    }
    .ant-popover-placement-bottom, .ant-popover-placement-bottomLeft, .ant-popover-placement-bottomRight {
      padding-top: 0px !important;
    }
    .ant-popover-inner-content {
      padding: 21px 0;
      max-height: 1000px;
    }
  }
  .popover-action--global {
    padding-top: 9px !important;
    position: fixed;
    .ant-popover-inner {
      border-radius: 4px;
    }
    .ant-popover-inner-content {
      padding: 4px 4px;
    }
    .anticon {
      vertical-align: 0;
      margin-top: 8px;
      margin-right: 2px;
    }
  }
  .text-item{
        
    span{
        font-weight: 400;
        font-size: 12px;
        line-height: 14px;
        text-decoration-line: underline;
        color: #3D56A6;
    }
  }
  .align-items-center{
    align-items: center;
  }
  .dropdown-order{
    background: #FFFFFF;
    box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.2);
    border-radius: 4px;

    .ant-menu-title-content{
      width: 100%;
    }

    .total-title{
      font-weight: 700;
      font-size: 16px;
      line-height: 18px;
      display: flex;
      align-items: center;
      color: #4F4F4F;
      padding: 25px 0 0 25px;
    }

    .ant-menu-item{
      height: 80px;
      display: flex;
      width: auto;
      align-items: center;
      width: 656px;
      background-color: #fff !important;

      &:hover{
        background: #F7F7F9 !important ;

        .item-varient, .item-price, .item-quantity, .item-total, .item-sku{
          color:  #000;
        }
      }
      .item-varient, .item-price, .item-quantity, .item-total, .item-sku{
        color:  #000;
      }

      .item-name{
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-weight: 400;
        font-size: 14px;
        line-height: 18px;
        color: #2F80ED;
        padding: 0 5px;
      }
      .item-varient{
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding: 0 5px;
        line-height: 18px;
        font-size: 12px;
      }
      .item-total{
        float: right;
        padding-right: 15px;
      }
      .item-sku{
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding: 0 5px;
        line-height: 18px;
        font-size: 12px;
      }
    }
  }

  .modal-store-custom{
    .modal-title{
      font-weight: 700;
      font-size: 18px;
      line-height: 21px;
      color: #333333;
      margin-bottom: 5px;
    }
    .modal-suggest{
      font-weight: 400;
      font-size: 14px;
      line-height: 16px;
      color: #333333;
      margin-bottom: 20px;
    }
    .ant-list{
      margin-top: 15px;
    }
    .ant-list-footer{
      padding-top: 35px;

      .btn-list{
        display: flex;
        justify-content: flex-end;
      }
    }
  }
`;
