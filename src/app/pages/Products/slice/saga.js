import { call, put, takeLatest } from 'redux-saga/effects';
import request from 'utils/request';
import { productsActions as actions } from '.';
// import { message } from 'antd';
import { serializeAPI } from 'utils/helpers';

const PRODUCT_SERVICE = 'product-service';

export function* getProductList({ payload }) {
  // yield delay(3000);
  try {
    const response = yield call(
      request,
      ...[
        `${PRODUCT_SERVICE}/products?${serializeAPI(payload)}`,
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

export function* getProductDetail({ payload }) {
  yield put(actions.setDetailId(payload));
  try {
    const response = yield call(
      request,
      ...[`${PRODUCT_SERVICE}/product/${payload}/detail`],
    );

    if (response.is_success) {
      yield put(actions.getProductDetailDone(response));
    } else {
      yield put(actions.getProductDetailError(response.error_code));
    }
  } catch (error) {
    yield put(
      actions.getProductDetailError(
        error.data.message || error.data.error_code,
      ),
    );
  }
}

export function* productsSaga() {
  yield takeLatest(actions.getProductList.type, getProductList);
  yield takeLatest(actions.getProductDetail.type, getProductDetail);
}
