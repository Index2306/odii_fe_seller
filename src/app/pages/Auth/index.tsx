/**
 *
 * Auth
 *
 */
import * as React from 'react';
import { useTranslation } from 'react-i18next';
// import { PageWrapper } from 'app/components/PageWrapper';
import SecurityCode from './Features/SecurityCode';
import { Signin } from './Features/Signin';
import { Signup } from './Features/Signup';
import { ForgotPass } from './Features/Forgot-Password';
import { ResetPassword } from './Features/Reset-Password';
import ActiveUser from './Features/Active-User';
import AuthLayout from 'app/components/Auth/Layout';
import SecurityCodeLayout from 'app/components/Auth/SecurityCode';
import RegisteredLayout from 'app/components/Auth/RegisteredLayout';
import { GoogleOAuthProvider } from '@react-oauth/google';
// import 'assets/scss/pages/auth.scss';
// import { messages } from './messages';
// import { useGlobalSlice } from 'app/pages/AppPrivate/slice';
// import { useDispatch } from 'react-redux';
import { selectCurrentUser } from 'app/pages/AppPrivate/slice/selectors';
import { useSelector } from 'react-redux';
import Registered from './Features/Registerd';
import { checkSecurityCode } from 'utils/common';

enum authType {
  SIGN_IN = 'signin',
  SIGN_UP = 'signup',
  RESET_PASSWORD = 'reset-password',
  FORGOT_PASS = 'forgot-password',
  REGISTERED = 'registered',
  ACTIVE_USER = 'active-user',
  SECURITY_CODE = 'security-code',
}

enum authLayout {
  AUTH = 'auth',
  REGISTERED = 'registered',
  SECURITY_CODE = 'security-code',
}
interface Props {
  history?: any;
  location?: {
    search: string | null;
  };
  match?: {
    params: {
      type?: authType | null;
    };
  };
}
export interface AuditCompareRouteParams {
  type: string;
}

export function Auth({ history, location, match }: Props) {
  let type = match?.params?.type ?? authType.SIGN_IN;
  // if (!checkSecurityCode()) {
  //   type = authType.SECURITY_CODE;
  // }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t, i18n } = useTranslation();
  // const dispatch = useDispatch();
  // const { actions } = useGlobalSlice();
  // const ref = React.useRef({ Value: renderComponent(type) });
  // const [layout, setLayout] = React.useState(authLayout.AUTH);
  const [layout, setLayout] = React.useState(
    // !checkSecurityCode() ? authLayout.SECURITY_CODE : authLayout.AUTH,
    authLayout.AUTH,
  );
  const [Component, setComponent] = React.useState(<Signin />);
  const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  // const [Component, setComponent] = React.useState<{
  // Value: React.FC;
  // }>({ Value: renderComponent(type) });

  React.useEffect(() => {
    if (
      (type === authType.REGISTERED || type === authType.ACTIVE_USER) &&
      layout !== authLayout.REGISTERED
    ) {
      setLayout(authLayout.REGISTERED);
    } else if (type === authType.SECURITY_CODE) {
      setLayout(authLayout.SECURITY_CODE);
    } else {
      setLayout(authLayout.AUTH);
    }
    if (type) {
      const Value: any = renderComponent(type);
      // ref.current = { Value };
      setComponent(Value);
    }
  }, [type]);

  const userInfo = useSelector(selectCurrentUser);

  React.useEffect(() => {
    if (userInfo && userInfo.status === 'active') {
      window.location.href = '/';
    }
  }, [userInfo]);

  let LayoutComponent = SecurityCodeLayout;
  if (layout === authLayout.AUTH) {
    LayoutComponent = AuthLayout;
  } else if (layout === authLayout.REGISTERED) {
    LayoutComponent = RegisteredLayout;
  }
  // const LayoutComponent =
  //   layout === authLayout.AUTH
  //     ? AuthLayout
  //     : layout === authLayout.SECURITY_CODE
  //     ? SecurityCodeLayout
  //     : RegisteredLayout;

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID || ''}>
      <LayoutComponent>{Component}</LayoutComponent>
    </GoogleOAuthProvider>
  );
}

const renderComponent = (type: authType) => {
  switch (type) {
    case authType.SIGN_UP:
      return <Signup />;
    case authType.FORGOT_PASS:
      return <ForgotPass />;
    case authType.RESET_PASSWORD:
      return <ResetPassword />;
    case authType.REGISTERED:
      return <Registered />;
    case authType.ACTIVE_USER:
      return <ActiveUser />;
    case authType.SECURITY_CODE:
      return <SecurityCode />;
    default:
      return <Signin />;
  }
};
