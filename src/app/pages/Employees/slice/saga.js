import { call, put, takeLatest, delay } from 'redux-saga/effects';
import { isEmpty } from 'lodash';
import request from 'utils/request';
import { message } from 'antd';
import { employeesActions as actions } from '.';

const USER_SERVICE = 'user-service/';
const url = '?page=1&page_size=10';

export function* getData({ payload }) {
  yield delay(500);
  const requestURL = `${USER_SERVICE}users/me/partner${payload}`;
  try {
    const repos = yield call(request, ...[requestURL, {}]);
    if (!isEmpty(repos)) {
      yield put(actions.getDone(repos));
    } else {
      yield put(actions.getError());
    }
  } catch (err) {
    yield put(actions.getError());
  }
}

export function* getDataRole({ payload }) {
  yield delay(500);
  const requestURL = `${USER_SERVICE}seller/roles`;
  try {
    const repos = yield call(request, ...[requestURL]);

    if (!isEmpty(repos)) {
      yield put(actions.getDataRoleDone(repos));
    } else {
      yield put(actions.getDataRoleError());
    }
  } catch (err) {
    yield put(actions.getDataRoleError());
  }
}

export function* getDataStoreIds({ payload }) {
  yield delay(500);
  const requestURL = `${USER_SERVICE}seller/users/me/stores`;
  try {
    const repos = yield call(request, ...[requestURL]);

    if (!isEmpty(repos)) {
      yield put(actions.getDataStoreIdsDone(repos));
    } else {
      yield put(actions.getDataStoreIdsError());
    }
  } catch (err) {
    yield put(actions.getDataStoreIdsError());
  }
}

export function* inviteUser({ payload, history }) {
  const requestURL = `${USER_SERVICE}users/me/seller-invite-to-partner`;
  try {
    const repos = yield call(
      request,
      ...[requestURL, { method: 'post', data: payload.data }],
    );
    message.success('Đã gửi lời mời tham gia thành công !');
    if (!isEmpty(repos)) {
      history.push(`/employees`);
      yield put(actions.inviteUserDone());
    } else {
      yield put(actions.inviteUserError());
    }
  } catch (err) {
    yield put(actions.inviteUserError());
  }
}

export function* deleteEmployee({ payload }) {
  const requestURL = `${USER_SERVICE}users/me/seller-remove-staff`;
  try {
    const repos = yield call(
      request,
      ...[requestURL, { method: 'post', data: payload.data }],
    );
    message.success('Xóa thành công nhân viên khỏi hệ thống !');
    if (!isEmpty(repos)) {
      yield put(actions.deleteEmployeeDone());
      yield put(actions.getData(url));
    } else {
      yield put(actions.deleteEmployeeError());
    }
  } catch (err) {
    yield put(actions.deleteEmployeeError());
  }
}

export function* getDetail({ payload }) {
  yield delay(500);
  const requestURL = `${USER_SERVICE}users/me/partner/${payload}`;
  try {
    const repos = yield call(request, ...[requestURL, {}]);
    if (!isEmpty(repos)) {
      yield put(actions.getDetailDone(repos));
    } else {
      yield put(actions.getDetailError());
    }
  } catch (err) {
    yield put(actions.getDetailError());
  }
}

export function* updateUser({ payload }) {
  yield delay(500);
  const requestURL = `${USER_SERVICE}users/me/update-roles-for-staff`;
  try {
    const repos = yield call(
      request,
      ...[
        requestURL,
        {
          method: 'put',
          data: payload.data,
        },
      ],
    );
    message.success('Cập nhật thành công !');
    if (!isEmpty(repos)) {
      yield put(actions.getDone(repos));
      yield put(actions.getDetail(payload.id));
    } else {
      yield put(actions.getError());
    }
  } catch (err) {
    yield put(actions.getError());
  }
}

export function* updateStatusUser({ payload }) {
  yield delay(500);
  const requestURL = `${USER_SERVICE}users/me/update-status-for-staff`;
  try {
    const repos = yield call(
      request,
      ...[
        requestURL,
        {
          method: 'put',
          data: payload.data,
        },
      ],
    );
    message.success('Cập nhật thành công !');
    if (!isEmpty(repos)) {
      yield put(actions.getDone(repos));
      payload.id
        ? yield put(actions.getDetail(payload.id))
        : yield put(actions.getData(url));
    } else {
      yield put(actions.getError());
    }
  } catch (err) {
    yield put(actions.getError());
  }
}

export function* employeesSaga() {
  yield takeLatest(actions.getData.type, getData);
  yield takeLatest(actions.getDataRole.type, getDataRole);
  yield takeLatest(actions.inviteUser.type, inviteUser);
  yield takeLatest(actions.getDataStoreIds.type, getDataStoreIds);
  yield takeLatest(actions.deleteEmployee.type, deleteEmployee);
  yield takeLatest(actions.getDetail.type, getDetail);
  yield takeLatest(actions.updateUser.type, updateUser);
  yield takeLatest(actions.updateStatusUser.type, updateStatusUser);
}
