import styled from 'styled-components/macro';
import { styledSystem } from 'styles/theme/utils';
import { SectionWrapper } from 'styles/commons';
import { Form, Link, Avatar } from 'app/components';
import { Switch, Modal, Select } from 'antd';

export const Section = styledSystem(styled(SectionWrapper)`
  padding-bottom: 20px;
  border-radius: 4px;
  border: 1px solid #ebebf0;
  box-shadow: 0px 4px 10px rgba(30, 70, 117, 0.05);
  .mb-0 {
    margin: 0;
  }
  .mt-16 {
    margin-top: 16px;
  }
  .mt-24 {
    margin-top: 24px;
  }
  .mt-48 {
    margin-top: 48px;
  }
  .bold {
    font-weight: bold;
  }
  .link-reset__pass {
    color: #2f80ed;
  }
  .avatar {
    text-align: center;
  }
  .name {
    margin-top: 14px;
    font-weight: bold;
    font-size: 16px;
    line-height: 19px;
  }
  .item {
    display: flex;
    justify-content: space-between;
    .label {
      color: #828282;
    }
    .phone {
      color: #2f80ed;
    }
  }
  .status {
    padding: 12px;
    border: 1px solid #ebebf0;
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
    .label {
      margin: auto 16px auto 0;
      font-weight: bold;
    }
  }
  .divider {
    border-top: 1px solid #ebebf0;
    padding-top: 20px;
  }
`);

export const CustomForm = styled(Form)`
  img {
    width: 108px;
    height: 108px;
    border-radius: 50%;
  }
  label {
    font-weight: bold;
  }
  .ant-input[disabled] {
    color: #333333;
  }
  .CustomCol {
    padding-left: 60px !important;
    &:first-child {
      border-right: 2px solid #b1aeae;
    }
    &:last-child {
      padding-left: 100px !important;
    }
  }
  .title {
    font-weight: 600;
    font-size: 16px;
    color: blue;
    margin-bottom: 18px;
  }
  .item-role {
    &:not(:first-child) {
      margin-left: 40px;
    }
    .title-role {
      font-weight: 600;
      font-size: 14px;
      line-height: 19px;
      color: #333333;
    }
    .content-role {
      font-size: 14px;
      line-height: 19px;
      color: #333333;
      font-weight: normal;
    }
  }
  .ant-checkbox-wrapper {
    margin-left: unset;
  }
`;

export const CustomSwitch = styled(Switch)`
  &.ant-switch-checked {
    background: #4869de;
  }
`;

export const TxtRequired = styled.div`
  color: #ff4d4f;
`;

export const CustomModal = styled(Modal)`
  top: 30px;
  .ant-modal-content {
    min-width: 600px;
    background: #f4f6fd;
    border-radius: 6px;
  }
  .title {
    font-weight: bold;
    font-size: 18px;
    line-height: 21px;
    color: #3d56a6;
  }
  .content {
    font-weight: normal;
    font-size: 14px;
    line-height: 20px;
  }
  .ant-divider-horizontal {
    min-width: 600px;
    /* margin: 24px -24px; */
  }
  .store {
    .ant-select-selector {
      height: 40px;
    }
  }
  .ant-checkbox-group {
    max-height: 280px;
    padding: 8px 8px;
    overflow: auto;
    background-color: white;
    border-radius: 4px;
    border: 1px solid #ebebf0;
  }
  .required {
    .ant-form-item-label {
      &::before {
        display: inline-block;
        color: #ff4d4f;
        font-size: 14px;
        font-family: SimSun, sans-serif;
        line-height: 1;
        content: '*';
        margin-right: 4px;
      }
    }
  }
`;

export const CustomAvatar = styled(Avatar)`
  width: 45px;
  height: 45px;
  font-size: 22px;
`;

export const CustomLink = styled(Link)`
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  color: #333333;
`;

export const CustomDivRole = styled.div`
  display: flex;
  &::before {
    content: ' ';
    text-align: left;
    margin: auto 0;
    height: 6px;
    margin-right: 7px;
    width: 6px;
    background-color: black;
    border-radius: 50%;
    display: inline-block;
  }
`;

export const CustomDivRoleOwner = styled.div`
  display: flex;
  color: #2f80ed;
  &::before {
    content: ' ';
    text-align: left;
    margin: auto 0;
    height: 6px;
    margin-right: 7px;
    width: 6px;
    background-color: #2f80ed;
    border-radius: 50%;
    display: inline-block;
  }
`;

export const CustomSelect = styled(Select)`
  border-radius: 4px;
  border: solid 1px #ebebf0;
  width: 100%;
  .ant-select-selector {
    border: unset !important;
  }
`;

export const CustomDivStore = styled.div`
  display: flex;
  .store-info {
    margin: auto 12px;
  }
  .store-name {
    font-weight: 600;
    font-size: 14px;
    line-height: 19px;
    color: #333333;
  }
  .store-desc {
    font-size: 14px;
    line-height: 19px;
    color: #333333;
  }
`;

export const CustomModalConfirm = styled(Modal)`
  .ant-modal-content {
    margin-top: 45%;
  }
  .modal {
    &__title {
      font-size: 18px;
      font-weight: 500;
      text-align: center;
    }
    &__content {
      margin-top: 12px;
      color: gray;
      font-size: 14px;
      text-align: center;
    }
    &__btn {
      margin-top: 32px;
      display: flex;
      justify-content: space-between;
    }
  }
`;
