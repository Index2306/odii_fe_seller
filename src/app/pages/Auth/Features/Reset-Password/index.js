/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 *
 * Change Pass
 *
 */
import * as React from 'react';
import { Form, Input, Alert } from 'antd';
import { Link } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
// import { useSelector, useDispatch } from 'react-redux';
// import { messages } from './messages';
import url from 'url';
import request from 'utils/request';
import { captcha } from 'utils/providers';
import { validatePassWord } from 'app/pages/Auth/utils';
import constants from 'assets/constants';
import {
  LoadingOutlined,
  // MailOutlined,
  EyeFilled,
  EyeInvisibleOutlined,
  LockOutlined,
} from '@ant-design/icons';
import { ComponentAuthMain, CustomDivButton, Icon, FormAlert } from '../styled';

export function ResetPassword(props) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [password, setPassword] = React.useState('');
  const [canSubmit, setCanSubmit] = React.useState(false);
  const [alert, setAlert] = React.useState(null);
  // const { t } = useTranslation();
  // const dispatch = useDispatch();
  // const isLoading = useSelector(selectLoading);

  const URL = url.parse(window.location.href);
  const params = new URLSearchParams(URL.query);
  const token = params.get('token');

  const handleChangePasswordSubmit = () => {
    setIsLoading(true);

    captcha().then(async function (recaptcha_token) {
      const data = { active_token: token, password: password, recaptcha_token };

      const response = await request('user-service/reset-password', {
        method: 'post',
        data: data,
        requireAuth: false,
      })
        .then(response => response)
        .catch(error => error);

      if (response.is_success) {
        setAlert(
          <Alert
            message="Đổi mật khẩu thành công"
            action={<Link to="/auth/signin">Đăng nhập</Link>}
            type="success"
          />,
        );
      } else {
        const code = response?.data?.error_code || response?.data?.error;
        const messageError = constants.ERRORS__AUTH[code] || code;
        setAlert(<Alert message={messageError} type="error" />);
      }
    });
    setIsLoading(false);
  };

  const handleChangePassword = e => {
    setPassword(e.target.value.trim());
  };

  const handleChangeRePassword = e => {
    if (e.target.value === password) {
      setCanSubmit(true);
    } else {
      setCanSubmit(false);
    }
  };

  return (
    <ComponentAuthMain>
      <div className="main-body-page">Đổi mật khẩu</div>

      {alert && <FormAlert>{alert}</FormAlert>}

      <Form name="signin" initialValues={{ remember: true }}>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập mật khẩu',
            },
            { min: 8, message: 'Mật khẩu ít nhất 8 kí tự' },
            validatePassWord,
          ]}
        >
          <Input.Password
            className="odii-input"
            placeholder="Nhập mật khẩu mới"
            prefix={<LockOutlined />}
            iconRender={visible =>
              visible ? (
                <Icon>
                  <EyeFilled />
                </Icon>
              ) : (
                <Icon>
                  <EyeInvisibleOutlined />
                </Icon>
              )
            }
            onChange={handleChangePassword}
          />
        </Form.Item>

        <Form.Item
          name="repassword"
          dependencies={['password']}
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập lại mật khẩu',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Mật khẩu không trùng khớp'));
              },
            }),
          ]}
        >
          <Input.Password
            className="odii-input"
            placeholder="Nhập lại mật khẩu mới"
            prefix={<LockOutlined />}
            iconRender={visible =>
              visible ? (
                <Icon>
                  <EyeFilled />
                </Icon>
              ) : (
                <Icon>
                  <EyeInvisibleOutlined />
                </Icon>
              )
            }
            onChange={handleChangeRePassword}
          />
        </Form.Item>
      </Form>

      <CustomDivButton>
        <button
          className="form-button"
          onClick={handleChangePasswordSubmit}
          disabled={!canSubmit}
        >
          {isLoading && (
            <>
              <LoadingOutlined />
              &ensp;
            </>
          )}
          Đổi mật khẩu
        </button>
      </CustomDivButton>

      <div className="form-action">
        <span></span>

        <Link to={'/auth/signin'}>Quay lại</Link>
      </div>
    </ComponentAuthMain>
  );
}
