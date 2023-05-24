/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 *
 * Forgot Password
 *
 */
import * as React from 'react';
import { Form, Input, Alert } from 'antd';
import { Link } from 'react-router-dom';
import request from 'utils/request';
import { captcha } from 'utils/providers';
import constants from 'assets/constants';
// import { useTranslation } from 'react-i18next';
// import { useDispatch } from 'react-redux';
// import { messages } from './messages';
// import { useAuthSlice } from '../../slice';
import { UserOutlined, LoadingOutlined } from '@ant-design/icons';
import { ComponentAuthMain, CustomDivButton, FormAlert } from '../styled';

export function ForgotPass(props) {
  const [email, setEmail] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [alert, setAlert] = React.useState(null);
  // const { t } = useTranslation();
  // const dispatch = useDispatch();
  // const { actions } = useAuthSlice();
  // const isLoading = useSelector(selectLoading);

  const handleChangeEmail = e => {
    setEmail(e.target.value.trim());
  };

  const handleResetPassword = () => {
    setIsLoading(true);
    captcha().then(async function (recaptcha_token) {
      const response = await request('user-service/forgot', {
        method: 'post',
        data: { email: email, recaptcha_token },
        requireAuth: false,
      })
        .then(response => response)
        .catch(error => error);

      if (response.is_success) {
        setAlert(
          <Alert
            message="Một mật khẩu mới đã được gửi đến email của bạn. Vui lòng kiểm tra email"
            type="success"
          />,
        );
      } else {
        const code = response?.data?.error_code || response?.data?.error;
        const messageError = constants.ERRORS__AUTH[code] || code;
        setAlert(<Alert message={messageError} type="error" />);
      }

      setIsLoading(false);
    });
  };

  return (
    <ComponentAuthMain>
      <div className="main-body-page">Quên mật khẩu</div>

      {alert && <FormAlert>{alert}</FormAlert>}

      <Form name="signin" initialValues={{ remember: true }}>
        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập email',
            },
            {
              type: 'email',
              message: 'Email chưa đúng định dạng',
            },
          ]}
        >
          <Input
            className="odii-input"
            placeholder="Nhập email"
            prefix={<UserOutlined />}
            onChange={handleChangeEmail}
          />
        </Form.Item>
      </Form>

      <CustomDivButton>
        <button className="form-button" onClick={handleResetPassword}>
          {isLoading && (
            <>
              <LoadingOutlined />
              &ensp;
            </>
          )}
          Gửi mật khẩu
        </button>
      </CustomDivButton>

      <div className="form-action">
        <span></span>

        <Link to={'/auth/signin'}>Quay lại</Link>
      </div>
    </ComponentAuthMain>
  );
}
