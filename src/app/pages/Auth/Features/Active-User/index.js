import * as React from 'react';
import { useSelector } from 'react-redux';
import { RegisteredIMG } from 'assets/images';
import { Alert } from 'antd';
// import notification from 'utils/notification';
import { Button, Form, Input } from 'app/components';
import { selectAccessToken } from 'app/pages/AppPrivate/slice/selectors';
import request from 'utils/request';
import { captcha } from 'utils/providers';
import { saveToken } from 'app/pages/AppPrivate/utils';
import { useLocation } from 'react-router-dom';
import { UserOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { FormAlert, ComponentAuthRegister } from '../styled';

function ActiveUser() {
  const [form] = Form.useForm();
  const AccessToken = useSelector(selectAccessToken);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const token = params.get('token');

  // const isLoading = useSelector(selectLoading);
  const [loading, setLoading] = React.useState(false);
  const [isUserActived, setIsUserActived] = React.useState(true);
  const [message, setMessage] = React.useState('');
  const [alert, setAlert] = React.useState(null);

  React.useEffect(() => {
    if (!token) {
      goLogin();
    } else {
      activeUser();
    }
  }, []);

  // React.useEffect(() => {
  //   const userEmail = params.get('email');
  //   form.setFieldsValue({ email: userEmail });
  // }, []);

  const activeUser = () => {
    const url = 'user-service/active-user';
    setLoading(true);
    captcha().then(async function (recaptcha_token) {
      const response = await request(url, {
        method: 'post',
        data: { active_token: token, recaptcha_token },
        requireAuth: false,
      })
        .then(response => response)
        .catch(err => err);
      setLoading(false);
      const data = response?.data;
      if (response?.is_success) {
        setMessage('Kích hoạt tài khoản thành công');
        await saveToken(response?.data);
      } else if (data?.error_code === 'user_activated') {
        setMessage('Tài khoản đã được kích hoạt từ trước');
      } else {
        setIsUserActived(false);
        setMessage('Đường dẫn xác thực không chính xác hoặc đã hết hạn');
        // notification('error', response?.error_code, 'Có lỗi xảy ra!', 7);
      }
    });
  };

  const resendEmail = values => {
    setLoading(true);
    captcha().then(async function (recaptcha_token) {
      const response = await request('user-service/resend-email-active-user', {
        method: 'post',
        data: { ...values, recaptcha_token },
        requireAuth: false,
      })
        .then(response => response)
        .catch(error => error);
      setLoading(false);
      if (response.is_success) {
        setAlert(<Alert message="Gửi mã xác thực thành công" type="success" />);
      } else {
        setAlert(
          <Alert
            message={response.data.error_code || response.data.error}
            type="error"
          />,
        );
      }
    });
  };

  const onFinish = values => {
    resendEmail(values);
  };

  const goDashboard = () => {
    window.location.href = '/dashboard';
  };

  const goLogin = () => {
    localStorage.clear();
    window.location.href = '/auth/signin';
  };

  return (
    <ComponentAuthRegister>
      {isUserActived && (
        <CustomImg className="registered__img">
          <img src={RegisteredIMG} alt="" />
        </CustomImg>
      )}

      <div className="registered__title">{message}</div>

      {isUserActived || (
        <div className="registered__desc">
          Xác thực tài khoản không thành công, nhập email để lấy mã xác thực
          khác
        </div>
      )}

      {isUserActived ? (
        AccessToken ? (
          <CustomDiv>
            <Button
              className="btn-md btn-login"
              width="200px"
              onClick={goDashboard}
            >
              Truy cập ngay
            </Button>
          </CustomDiv>
        ) : (
          <CustomDiv>
            <Button
              className="btn-md btn-login"
              width="200px"
              onClick={goLogin}
            >
              Đăng nhập ngay
            </Button>
          </CustomDiv>
        )
      ) : (
        <div className="registered__form">
          {alert && <FormAlert>{alert}</FormAlert>}

          <Form
            name="resend"
            onFinish={onFinish}
            form={form}
            disabled={loading}
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
                // className="odii-input"
                placeholder="Nhập email"
                color="grayBlue"
                prefix={<UserOutlined />}
              />
            </Form.Item>
            <Button
              className="btn-md"
              type="primary"
              htmlType="submit"
              fontWeight="500 !important"
              // onClick={resendEmail}
            >
              GỬI MÃ XÁC THỰC
            </Button>
          </Form>
        </div>
      )}
    </ComponentAuthRegister>
  );
}

export default React.memo(ActiveUser);

const CustomImg = styled.div`
  display: flex;
  img {
    margin: auto;
  }
`;

const CustomDiv = styled.div`
  .btn-login {
    margin: auto;
    /* width: 100%; */
    margin-top: 24px;
    font-weight: 500;
    font-size: 16px;
  }
`;
