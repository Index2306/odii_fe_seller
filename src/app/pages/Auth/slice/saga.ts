import { call, put, takeLatest, delay } from 'redux-saga/effects';
import request from 'utils/request';
import { isEmpty } from 'lodash';
import { saveToken } from 'app/pages/AppPrivate/utils';
import { globalActions } from 'app/pages/AppPrivate/slice';
// import { useAuthSlice } from '../../slice';
// import { selectUsername } from './selectors';
import { authActions as actions } from '.';
import { message } from 'antd';
import { RepoErrorType } from './types';

const USER_SERVICE = 'user-service';

export function* login(data) {
  const requestURL = `${USER_SERVICE}/signin`;

  try {
    const response = yield call(
      request,
      ...[
        requestURL,
        { method: 'post', data: data.payload, requireAuth: false },
      ],
    );

    if (response?.is_success) {
      saveToken(response?.data);
      globalActions.changeAccessToken(response?.access_token);
      yield put(actions.signinDone(response));
    } else {
      yield put(actions.signinError(response?.error_code));
    }
  } catch (err) {
    yield put(actions.signinError(RepoErrorType.RESPONSE_ERROR));
  }
}

// export function* authSaga() {
//   yield takeLatest(actions.signin.type, login);
// }

export function* regis(data) {
  const requestURL = `${USER_SERVICE}/signup`;

  try {
    const response = yield call(
      request,
      ...[
        requestURL,
        { method: 'post', data: data.payload, requireAuth: false },
      ],
    );
    if (response.is_success) {
      yield put(actions.signupDone(response));
    } else {
      yield put(actions.signinError(response.error_code));
    }
  } catch (error) {
    yield put(actions.signupError(RepoErrorType.RESPONSE_ERROR));
  }
}

export function* forgotpass(data) {
  yield delay(500);
  const requestURL = 'user-service/forgot';
  try {
    // Call our request helper (see 'utils/request')
    const repos: { is_success: boolean } = yield call(
      request,
      ...[
        requestURL,
        {
          method: 'post',
          data: data.payload,
          requireAuth: false,
        },
      ],
    );
    if (!isEmpty(repos)) {
      yield put(actions.signupDone(repos));
      message.success('Lấy lại mật khẩu thành công!');
    } else {
      yield put(actions.signupError(RepoErrorType.RESPONSE_ERROR));
    }
  } catch (err) {
    yield put(actions.signupError(RepoErrorType.RESPONSE_ERROR));
  }
}

export function* changepass(data) {
  yield delay(500);
  const requestURL = 'user-service/users/me/change-password';
  try {
    // Call our request helper (see 'utils/request')
    const repos: { is_success: boolean } = yield call(
      request,
      ...[
        requestURL,
        {
          method: 'post',
          data: data.payload,
          // requireAuth: false,
        },
      ],
    );
    if (!isEmpty(repos)) {
      yield put(actions.signupDone(repos));
      message.success('Đổi mật khẩu thành công!');
    } else {
      yield put(actions.signupError(RepoErrorType.RESPONSE_ERROR));
    }
  } catch (err) {
    yield put(actions.signupError(RepoErrorType.RESPONSE_ERROR));
  }
}

export function* authSaga() {
  yield takeLatest(actions.signin.type, login);
  yield takeLatest(actions.signup.type, regis);
  yield takeLatest(actions.forgotpass.type, forgotpass);
  yield takeLatest(actions.changepass.type, changepass);
}
