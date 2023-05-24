/**
 *
 * Signup
 *
 */
import React, { useEffect, useState } from 'react';
import { Form, Input, Alert } from 'antd';
import { Link } from 'react-router-dom';
// import GoogleLogin from 'react-google-login';
import { useGoogleLogin } from '@react-oauth/google';
import { Button } from 'app/components';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { GoogleIMG, FacebookIMG } from 'assets/images/icon';
import request from 'utils/request';
import { captcha } from 'utils/providers';
import { isEmpty } from 'lodash';
import { useHistory } from 'react-router-dom';
import { saveToken } from 'app/pages/AppPrivate/utils';
import { useLocation } from 'react-router';
import { validatePassWord } from '../../utils';
import { validatePhoneNumberVN } from 'utils/helpers';
import {
  getAffiliateCode,
  saveAffiliateCode,
  getAffiliateCodeFillInput,
} from 'utils/affiliate';
import constants from 'assets/constants';
import {
  LoadingOutlined,
  MailOutlined,
  EyeFilled,
  EyeInvisibleOutlined,
  LockOutlined,
  UserOutlined,
  PhoneOutlined,
} from '@ant-design/icons';
import { getCookie } from 'utils/helpers';
import { useDispatch } from 'react-redux';
import { globalActions } from 'app/pages/AppPrivate/slice';
import { ComponentAuthMain, Icon, FormAlert } from '../styled';
const Item = Form.Item;

export function Signup(props) {
  // const { t } = useTranslation();
  const location = useLocation();
  const [form] = Form.useForm();
  const history = useHistory();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [isDisableInputAffiliate, setIsDisableInputAffiliate] = useState(false);

  useEffect(() => {
    saveAffiliateCode(location);
  }, []);

  const { setFieldsValue } = form;

  useEffect(() => {
    if (!isEmpty(getAffiliateCodeFillInput())) {
      setFieldsValue({
        partner_affiliate_code: getAffiliateCodeFillInput() || '',
      });
      setIsDisableInputAffiliate(true);
    } else setIsDisableInputAffiliate(false);
  }, [getAffiliateCodeFillInput()]);

  // const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const FACEBOOK_APP_ID = process.env.REACT_APP_FACEBOOK_APP_ID;

  const handleSignup = async data => {
    setIsLoading(true);

    const response = await request('user-service/signup', {
      method: 'post',
      data: data,
      requireAuth: false,
    })
      .then(response => response)
      .catch(err => err);

    if (response.is_success) {
      history.push({
        pathname: '/auth/registered',
        state: data,
      });
    } else {
      const code = response?.data?.error_code || response?.data?.error;
      const messageError = constants.ERRORS__AUTH[code] || code;
      setAlert(<Alert message={messageError} type="error" />);
    }

    setIsLoading(false);
  };

  const login = async data => {
    const response = await request('user-service/signin', {
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
    onError: errorResponse => {},
    flow: 'auth-code',
  });

  const responseFacebook = async response => {
    setIsLoading(true);

    await login({
      token: response.accessToken,
      ...getAffiliateCode(),
      social_type: 'facebook',
    });

    setIsLoading(false);
  };

  const onFinish = async values => {
    await delete values.repassword;
    if (!values.partner_affiliate_code)
      await delete values.partner_affiliate_code;
    captcha().then(function (recaptcha_token) {
      // Send form value as well as token to the server
      handleSignup({
        ...values,
        ...getAffiliateCode(),
        recaptcha_token,
      });
    });
  };

  return (
    <ComponentAuthMain>
      <div className="main-body-page">Tạo mới tài khoản</div>

      {alert && <FormAlert>{alert}</FormAlert>}

      <Form form={form} name="signin" onFinish={onFinish} id="signup">
        <Item
          name="full_name"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập họ và tên',
            },
            { whitespace: true, message: 'Không được để trống' },
            {
              max: 100,
              message: 'Họ và tên của bạn quá 100 ký tự, vui lòng nhập lại',
            },
          ]}
        >
          <Input
            className="odii-input"
            placeholder="Nhập họ và tên"
            prefix={<UserOutlined />}
          />
        </Item>
        <Item
          name="phone"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập số điện thoại của bạn',
            },
            validatePhoneNumberVN,
          ]}
        >
          <Input
            className="odii-input"
            type="number"
            placeholder="Nhập SĐT"
            prefix={<PhoneOutlined />}
          />
        </Item>
        <Item
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
            prefix={<MailOutlined />}
          />
        </Item>
        <Item
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
            placeholder="Nhập mật khẩu"
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
        </Item>
        <Item
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
            placeholder="Nhập lại mật khẩu"
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
        </Item>
        <Item
          name="partner_affiliate_code"
          // rules={[
          //   {
          //     type: 'email',
          //     message: 'Email chưa đúng định dạng',
          //   },
          // ]}
        >
          <Input
            className="odii-input"
            placeholder="Nhập mã giới thiệu ( Nếu có)"
            disabled={isDisableInputAffiliate}
            // disabled={!isEmpty(getAffiliateCode())}
          />
        </Item>
        <Button
          className="btn-md"
          htmlType="submit"
          type="primary"
          disabled={isLoading}
          width="100%"
        >
          {isLoading && (
            <>
              <LoadingOutlined />
              &ensp;
            </>
          )}
          ĐĂNG KÝ
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
        <span>Bạn đã có tài khoản?</span>

        <Link to={'/auth/signin'}>Đăng nhập ngay</Link>
      </div>
    </ComponentAuthMain>
  );
}
