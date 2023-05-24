import { call, put, takeLatest, delay } from 'redux-saga/effects';
import { isEmpty } from 'lodash';
import request from 'utils/request';
import { formatDateForSend } from 'utils/helpers';
import { ordersActions as actions } from '.';
import { message } from 'antd';

const SERVICE = '/oms/seller/orders';

export function* getData({ payload }) {
  yield delay(500);
  const { search } = payload;
  const searchParams = new URLSearchParams(search);
  // if (searchParams.get('from_date')) {
  //   searchParams.set(
  //     'from_date',
  //     formatDateForSend(searchParams.get('from_date')),
  //   );
  //   searchParams.set(
  //     'to_date',
  //     formatDateForSend(searchParams.get('to_date'), true),
  //   );
  //   // searchParams.set('timezone', moment.tz.guess());
  // }

  const requestURL = `${SERVICE}?${searchParams}`;
  try {
    // Call our request helper (see 'utils/request')
    const repos = yield call(
      request,
      ...[requestURL, { isCheckRefresh: false }],
    );
    // const repos = {}
    if (!isEmpty(repos)) {
      yield put(actions.getDone(repos));
    } else {
      yield put(actions.getError());
    }
  } catch (err) {
    yield put(actions.getError());
  }
}

export function* getDetail({ payload }) {
  const requestURL = `${SERVICE}/${payload}`;
  try {
    // Call our request helper (see 'utils/request')
    const repos = yield call(request, ...[requestURL, {}]);
    // const repos = {}
    if (!isEmpty(repos)) {
      yield put(actions.getDetailDone(repos.data));
    } else {
      yield put(actions.getDetailError());
    }
  } catch (err) {
    yield put(actions.getDetailError(err.data));
  }
}

export function* updateAndCreate({ payload }) {
  const { id, data, push } = payload;
  const requestURL = `user-service/supplier/supplier-warehousing${
    id ? `/${id}` : ''
  }`;
  // const requestURL = `${SERVICE}supplier/product/${id}`;
  try {
    // Call our request helper (see 'utils/request')
    const repos = yield call(
      request,
      ...[requestURL, { method: id ? 'put' : 'post', data }],
    );
    // const repos = {}
    message.success('Thành công !');
    if (!isEmpty(repos)) {
      yield put(actions.updateAndCreateDone());
    } else {
      yield put(actions.updateAndCreateError());
    }
    if (!id) push('/warehousing');
  } catch (err) {
    yield put(actions.updateAndCreateError());
  }
}

export function* ordersSaga() {
  yield takeLatest(actions.getData.type, getData);
  yield takeLatest(actions.getDetail.type, getDetail);
  yield takeLatest(actions.updateAndCreate.type, updateAndCreate);
}
