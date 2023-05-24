/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 *
 * Signin
 *
 */
import * as React from 'react';
// import { useTranslation } from 'react-i18next';
import { Alert, Input } from 'antd';
import { Link } from 'react-router-dom';
// import GoogleLogin from 'react-google-login';
import { useGoogleLogin } from '@react-oauth/google';
import { Button, Form } from 'app/components';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { GoogleIMG, FacebookIMG } from 'assets/images/icon';
import { saveToken } from 'app/pages/AppPrivate/utils';
import request from 'utils/request';
import { getCookie } from 'utils/helpers';
import { useDispatch } from 'react-redux';
import { globalActions } from 'app/pages/AppPrivate/slice';
import { captcha } from 'utils/providers';
import { getAffiliateCode } from 'utils/affiliate';
import constants from 'assets/constants';
import {
  LoadingOutlined,
  MailOutlined,
  EyeFilled,
  EyeInvisibleOutlined,
  LockOutlined,
} from '@ant-design/icons';
import {
  ComponentAuthMain,
  Icon,
  // CustomModal,
  FormAlert,
} from '../styled';

export function Signin(props) {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = React.useState(false);
  const [alert, setAlert] = React.useState(null);

  const [form] = Form.useForm();
  // const { t } = useTranslation();

  // const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const FACEBOOK_APP_ID = process.env.REACT_APP_FACEBOOK_APP_ID;

  const requestURL = 'user-service/signin';

  const handleLogin = async values => {
    setIsLoading(true);

    await login(values);

    setIsLoading(false);
  };

  const login = async data => {
    const response = await request(requestURL, {
      method: 'post',
      data: { ...data, ati: getCookie('_ati') },
      requireAuth: false,
    })
      .then(response => response)
      .catch(error => error);
    if (response.is_success) {
      await saveToken(response?.data);
      await dispatch(
        globalActions.changeAccessToken(response?.data?.access_token),
      );
      const currentUser = await request(`user-service/users/me/profile`);
      switch (true) {
        case currentUser?.data?.roles?.includes('owner'):
          window.location.href = '/dashboard';
          break;
        case currentUser?.data?.roles?.includes('partner_product'):
          window.location.href = '/products';
          break;
        case currentUser?.data?.roles?.includes('partner_order'):
          window.location.href = '/orders';
          break;
        case currentUser?.data?.roles?.includes('partner_balance'):
          window.location.href = '/mywallet';
          break;
        case currentUser?.data?.roles?.includes('partner_store'):
          window.location.href = '/stores';
          break;
        case currentUser?.data?.roles?.includes('partner_member'):
          window.location.href = '/employees';
          break;
        default:
          window.location.href = '/dashboard';
          break;
      }
    } else {
      const code = response?.data?.error_code || response?.data?.error;
      const messageError = constants.ERRORS__AUTH[code] || code;
      setAlert(<Alert message={messageError} type="error" />);
    }
  };

  // const responseGoogle = async response => {
  //   if (response.tokenId) {
  //     setIsLoading(true);

  //     await login({
  //       token: response.tokenId,
  //       ...getAffiliateCode(),
  //       social_type: 'google',
  //     });

  //     setIsLoading(false);
  //   }
  // };

  const responseFacebook = async response => {
    setIsLoading(true);

    await login({
      token: response.accessToken,
      ...getAffiliateCode(),
      social_type: 'facebook',
    });

    setIsLoading(false);
  };

  const onFinish = values => {
    captcha().then(function (recaptcha_token) {
      // Send form value as well as token to the server
      handleLogin({
        ...values,
        recaptcha_token,
      });
    });
  };
  const loginGoogle = useGoogleLogin({
    onSuccess: async tokenResponse => {
      setIsLoading(true);
      await login({
        token: tokenResponse.code,
        ...getAffiliateCode(),
        social_type: 'google',
      });

      setIsLoading(false);
      // console.log(userInfo);
    },
    onError: errorResponse => {
      console.log('connect google error', errorResponse);
    },
    flow: 'auth-code',
  });
  return (
    <ComponentAuthMain>
      <div className="main-body-page">Đăng nhập</div>

      {alert && <FormAlert>{alert}</FormAlert>}

      <Form
        name="signin"
        id="signin"
        initialValues={{ remember: true }}
        form={form}
        onFinish={onFinish}
      >
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
            color="grayBlue"
            placeholder="Nhập email"
            className="odii-input"
            prefix={<MailOutlined />}
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập mật khẩu',
            },
            { min: 8, message: 'Mật khẩu ít nhất 8 kí tự' },
          ]}
        >
          <Input.Password
            placeholder="Nhập mật khẩu"
            className="odii-input"
            color="grayBlue"
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
          />
        </Form.Item>

        <div className="form-action justify-content-end">
          {/* <Checkbox defaultChecked={true}>Ghi nhớ đăng nhập</Checkbox> */}

          <Link to={'/auth/forgot-password'}>Quên mật khẩu?</Link>
        </div>
        <Button
          className="btn-md"
          htmlType="submit"
          type="primary"
          width="100%"
          disabled={isLoading}
          fontSize="16px !important"
        >
          {isLoading && (
            <>
              <LoadingOutlined />
              &ensp;
            </>
          )}
          ĐĂNG NHẬP
        </Button>
      </Form>

      <div className="form-divider">
        <span>Hoặc đăng nhập bằng</span>
      </div>

      <div className="form-social">
        <button
          className="form-social-btn"
          onClick={loginGoogle}
          // disabled={renderProps.disabled}
        >
          <img src={GoogleIMG} alt="" />
          Google Account
        </button>
        {/* <GoogleLogin
          clientId={GOOGLE_CLIENT_ID}
          buttonText="Google Account"
          render={renderProps => (
            <button
              className="form-social-btn"
              onClick={renderProps.onClick}
              disabled={renderProps.disabled}
            >
              <img src={GoogleIMG} alt="" />
              Google Account
            </button>
          )}
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
          cookiePolicy={'single_host_origin'}
        /> */}

        <FacebookLogin
          appId={FACEBOOK_APP_ID}
          autoLoad={false}
          fields="name,email,picture"
          callback={responseFacebook}
          render={renderProps => (
            <button className="form-social-btn" onClick={renderProps.onClick}>
              <img src={FacebookIMG} alt="" />
              Facebook Account
            </button>
          )}
        />
      </div>

      <div className="form-action">
        <span>Bạn chưa có tài khoản?</span>

        <Link to={'/auth/signup'}>Đăng ký ngay</Link>
      </div>
    </ComponentAuthMain>
  );
}
