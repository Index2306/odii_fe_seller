import { call, put, takeLatest, delay, all, select } from 'redux-saga/effects';
import { isEmpty } from 'lodash';
import { roundMoney } from 'utils/helpers';
import request from 'utils/request';
import constants from 'assets/constants';
import { productsActions as actions } from '.';
import notification from 'utils/notification';
import { selectDetails } from './selectors';

const PRODUCT_SERVICE = 'product-service/';

export function* getData({ payload }) {
  yield delay(500);
  const requestURL = `${PRODUCT_SERVICE}seller/store-product/listing${payload}`;
  try {
    // Call our request helper (see 'utils/request')
    const repos = yield call(
      request,
      ...[requestURL, { params: { is_selling: true } }],
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
  yield delay(500);
  const requestURL = id =>
    `${PRODUCT_SERVICE}seller/store-product/${id}/detail`;
  try {
    // Call our request helper (see 'utils/request')
    const repos = yield all(
      payload.map(id =>
        (function* () {
          try {
            return yield call(
              request,
              ...[requestURL(id), { params: { is_selling: true } }],
            );
          } catch (e) {
            return e; // **
          }
        })(),
      ),
    );
    const handleRepos = repos?.map(item => {
      const data = item.data;
      const variations = data.variations?.map(v => {
        return {
          ...v,
          retail_price:
            v.retail_price ||
            v.origin_supplier_price +
              roundMoney(
                v.origin_supplier_price * constants.PERCENT_MONEY.retail_price,
              ),
          retail_price_compare_at:
            v.retail_price_compare_at ||
            v.origin_supplier_price +
              roundMoney(
                v.origin_supplier_price *
                  constants.PERCENT_MONEY.retail_price_compare_at,
              ),
        };
      });
      return { ...data, variations };
    });
    // const repos = {}
    if (!isEmpty(repos)) {
      handleRepos.forceUpdate = payload.forceUpdate;
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
  const requestURL = id => `${PRODUCT_SERVICE}seller/store-product/${id}`;
  try {
    // Call our request helper (see 'utils/request')
    // const repos = yield call(
    //   request,
    //   ...[requestURL, { method: 'put', data }],
    // );
    let hasError = false;
    yield all(
      listData.map(item =>
        (function* () {
          try {
            return yield call(
              request,
              ...[
                requestURL(item.id),
                { method: 'put', data: item, params: { is_selling: true } },
              ],
            );
          } catch (e) {
            hasError = true;
            return e; // **
          }
        })(),
      ),
    );
    // const repos = {}
    if (!hasError) {
      notification('success', 'Thành công !');
      yield put(actions.updateDone());
    } else {
      yield put(actions.updateError());
    }
  } catch (err) {
    yield put(actions.updateError());
  }
}

export function* deleteItem({ payload }) {
  const { id, isDelete = false, isNeedActive = false } = payload;
  // const requestURL = `${PRODUCT_SERVICE}admin/product/${payload.id}`;
  const requestURL = `${PRODUCT_SERVICE}seller/store-product/${id}?is_selling=true&is_recover=${!isDelete}&is_need_active=${isNeedActive}`;
  try {
    const repos = yield call(request, ...[requestURL, { method: 'delete' }]);
    // const repos = {}
    if (repos) {
      let msgSuccess = isDelete ? 'Xoá' : 'Khôi phục';
      if (isNeedActive) msgSuccess = 'Kích hoạt';

      notification('success', `${msgSuccess} sản phẩm thành công!`);
      const details = yield select(selectDetails);
      const handleDetails = details.filter(item => item.id !== id);
      yield put(actions.setListSelling(handleDetails.map(item => item.id)));
      yield put(actions.getDetailDone(handleDetails));
      yield put(actions.deleteDone());
    } else {
      yield put(actions.deleteError());
    }
  } catch (err) {
    yield put(actions.deleteError());
  }
}

export function* sellingProductsSaga() {
  yield takeLatest(actions.getData.type, getData);
  yield takeLatest(actions.getDetail.type, getDetail);
  yield takeLatest(actions.update.type, update);
  yield takeLatest(actions.delete.type, deleteItem);
}
