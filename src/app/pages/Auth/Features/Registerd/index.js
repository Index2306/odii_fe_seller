import * as React from 'react';
import { RegisteredLoadIMG } from 'assets/images';
import { useLocation } from 'react-router-dom';
// import { Button } from 'app/components';
import request from 'utils/request';
import notification from 'utils/notification';
import { CustomStyle } from 'styles/commons';
import { Link } from 'app/components';
import { captcha } from 'utils/providers';
import styled from 'styled-components';
import constants from 'assets/constants';
import { ComponentAuthRegister } from '../styled';

export default function Registered() {
  const location = useLocation();
  const data = location.state;

  React.useEffect(() => {
    if (!data?.email) {
      window.location.href = '/auth/signup';
      // history.push('/auth/signup');
    }
  }, []);

  const resendEmail = () => {
    captcha().then(async function (recaptcha_token) {
      const response = await request('user-service/resend-email-active-user', {
        method: 'post',
        data: { email: data?.email, recaptcha_token },
        requireAuth: false,
      })
        .then(response => response)
        .catch(error => error);

      if (response.is_success) {
        notification('success', 'Gửi mã xác thực thành công', 'Thành công');
      } else {
        const code = response?.data?.error_code || response?.data?.error;
        const messageError = constants.ERRORS__AUTH[code] || code;
        notification('error', messageError, '');
      }
    });
  };

  return (
    <ComponentAuthRegister>
      <CustomImg className="registered__img">
        <img src={RegisteredLoadIMG} alt="" />
      </CustomImg>

      <div className="registered__title">Xác thực tài khoản</div>

      <div className="registered__desc">
        Cảm ơn bạn đã đăng ký và sử dụng dịch vụ của Odii. Chúng tôi đã gửi một
        email xác thực đến <br />
        <CustomStyle color="primary" display="inline-block" fontWeight="medium">
          {data?.email}
        </CustomStyle>
        . Vui lòng truy cập email và làm theo hướng dẫn
        <br />
        <br />
        <div className="d-flex justify-content-center align-items-center">
          Tôi chưa nhận được mã.
          <Link href="" onClick={resendEmail} style={{ cursor: 'pointer' }}>
            Gửi lại
          </Link>
        </div>
        <br />
        <Link to={'/auth/signin'} style={{ cursor: 'pointer' }}>
          Về trang Đăng nhập
        </Link>
      </div>
    </ComponentAuthRegister>
  );
}

const CustomImg = styled.div`
  display: flex;
  img {
    margin: auto;
  }
`;
