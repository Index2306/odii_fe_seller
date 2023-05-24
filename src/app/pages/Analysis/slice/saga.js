import {
  call,
  put,
  takeLatest,
  take,
  delay,
  all,
  select,
  takeEvery,
  fork,
  throttle,
} from 'redux-saga/effects';
import { isEmpty } from 'lodash';
import request from 'utils/request';
import { analysisActions as actions } from '.';
const PRODUCT_SERVICE = 'product-service/';

export function* getData({ payload }) {
  yield delay(500);
  const requestURL = `${PRODUCT_SERVICE}seller/store-product/listing${
    payload || ''
  }`;
  try {
    // Call our request helper (see 'utils/request')
    const repos = yield call(
      request,
      ...[requestURL, { params: { is_import_list: true } }],
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

export function* analysisSaga() {
  // yield takeLatest(actions.getData.type, getData);
}
