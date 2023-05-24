import { call, put, takeLatest, delay, all } from 'redux-saga/effects';
import { isEmpty } from 'lodash';
import request from 'utils/request';
import { productsActions as actions } from '.';
import notification from 'utils/notification';

const PRODUCT_SERVICE = 'product-service/';

export function* getData({ payload }) {
  yield delay(500);
  const requestURL = `${PRODUCT_SERVICE}seller/store-product/listing${payload}`;
  try {
    // Call our request helper (see 'utils/request')
    const repos = yield call(request, ...[requestURL, {}]);
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
  yield delay(500);
  const requestURL = id =>
    `${PRODUCT_SERVICE}seller/store-product/${id}/detail`;
  try {
    // Call our request helper (see 'utils/request')
    const repos = yield all(
      payload.map(id =>
        (function* () {
          try {
            return yield call(request, ...[requestURL(id), {}]);
          } catch (e) {
            return e; // **
          }
        })(),
      ),
    );
    const handleRepos = repos.map(item => item.data);
    // const repos = {}
    if (!isEmpty(repos)) {
      yield put(actions.getDetailDone(handleRepos));
    } else {
      yield put(actions.getDetailError());
    }
  } catch (err) {
    yield put(actions.getDetailError());
  }
}

export function* update({ payload }) {
  const { listData } = payload;
  // const requestURL = `${PRODUCT_SERVICE}admin/product/${payload.id}`;
  const requestURL = id => `${PRODUCT_SERVICE}seller/store-product${id}`;
  try {
    // Call our request helper (see 'utils/request')
    // const repos = yield call(
    //   request,
    //   ...[requestURL, { method: 'put', data }],
    // );
    const repos = yield all(
      listData.map(item =>
        (function* () {
          try {
            return yield call(
              request(item.id),
              ...[requestURL, { method: 'put', data: item }],
            );
          } catch (e) {
            return e; // **
          }
        })(),
      ),
    );
    // const repos = {}
    notification('success', 'Thành công !');
    if (!isEmpty(repos)) {
      yield put(actions.updateDone());
    } else {
      yield put(actions.updateError());
    }
  } catch (err) {
    yield put(actions.updateError());
  }
}

export function* selectedProductsSaga() {
  yield takeLatest(actions.getData.type, getData);
  yield takeLatest(actions.getDetail.type, getDetail);
  yield takeLatest(actions.update.type, update);
}
