import { call, put, takeLatest } from 'redux-saga/effects';
import request from 'utils/request';
import notification from 'utils/notification';
import { storesActions as actions } from '.';

const END_POINTER_STORE = 'product-service/seller';
const PRODUCT_SERVICE = 'product-service';

export function* getProductList({ payload }) {
  // yield delay(3000);
  try {
    const response = yield call(
      request,
      ...[
        `${PRODUCT_SERVICE}/seller/product-on-sale/listing${
          payload || '?page_size=20'
        }`,
        { isCheckRefresh: true },
      ],
    );

    if (response.is_success) {
      yield put(actions.getProductListDone(response));
    } else {
      yield put(actions.getProductListError(response.error_code));
    }
  } catch (error) {
    yield put(
      actions.getProductListError(error.data.message || error.data.error_code),
    );
  }
}

export function* getProductListV2({ payload }) {
  // yield delay(3000);
  try {
    const response = yield call(
      request,
      ...[
        `${PRODUCT_SERVICE}/seller/product-on-sale/listing-v2${
          payload || '?page_size=20'
        }`,
        { isCheckRefresh: true },
      ],
    );

    if (response.is_success) {
      yield put(actions.getProductListDone(response));
    } else {
      yield put(actions.getProductListError(response.error_code));
    }
  } catch (error) {
    yield put(
      actions.getProductListError(error.data.message || error.data.error_code),
    );
  }
}

export function* getStoresList({ payload }) {
  try {
    const response = yield call(
      request,
      // ...[`${END_POINTER_STORE}/stores?${serializeAPI(payload)}`],
      ...[`${END_POINTER_STORE}/stores`, { params: payload }],
    );
    if (response.is_success) {
      yield put(actions.getStoresListDone(response));
    } else {
      yield put(
        actions.getStoresListError(
          response.data?.error_code || response.data?.message,
        ),
      );
    }
  } catch (error) {
    yield put(
      actions.getStoresListError(error.data?.error_code || error.data?.message),
    );
  }
}

export function* updateTypeConnect({ payload }) {
  const { id, type } = payload;
  try {
    const response = yield call(
      request,
      ...[
        `${END_POINTER_STORE}/store/${id}/connect`,
        { method: 'put', data: { type } },
      ],
    );
    if (response.is_success) {
      yield put(actions.updateTypeConnectDone(response));
      yield put(actions.getStoresList());
      notification('success', 'Thành công!');
    } else {
      notification('error', 'Thất bại!');
      yield put(
        actions.updateTypeConnectError(
          response.data?.error_code || response.data?.message,
        ),
      );
    }
  } catch (error) {
    yield put(
      actions.updateTypeConnectError(
        error.data?.error_code || error.data?.message,
      ),
    );
  }
}

export function* storesSaga() {
  yield takeLatest(actions.getStoresList.type, getStoresList);
  yield takeLatest(actions.updateTypeConnect.type, updateTypeConnect);
  yield takeLatest(actions.getProductList.type, getProductList);
  yield takeLatest(actions.getProductListV2.type, getProductListV2);
}
