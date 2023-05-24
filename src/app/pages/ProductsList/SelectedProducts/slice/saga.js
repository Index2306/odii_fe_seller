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

export function* update({ payload, isSingle = false, index }) {
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

    if (isSingle) {
      // yield delay(10000);
      const cloneCurrent = { ...payload };
      if (cloneCurrent.attributes) {
        delete cloneCurrent.attributes;
      }
      const data = yield call(
        request,
        ...[requestURL(payload.id), { method: 'put', data: cloneCurrent }],
      );
      // yield fork(pushStore, { payload });
      // yield delay(10000);
      if (data.is_success) {
        yield put(actions.pushStore({ index, data: payload }));
        yield take(actions.pushStoreDone.type);
      } else {
        yield put(actions.updateError({ id: payload.id }));
      }
      return data;
    } else {
      yield all(
        listData.map(item =>
          (function* () {
            try {
              const cloneCurrent = { ...item };
              if (cloneCurrent.attributes) {
                delete cloneCurrent.attributes;
              }
              return yield call(
                request,
                ...[requestURL(item.id), { method: 'put', data: cloneCurrent }],
              );
            } catch (e) {
              hasError = true;
              return e; // **
            }
          })(),
        ),
      );
    }

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

export function* updateList({ payload }) {
  const { index, data, ignoreMsgSuccess = false } = payload;
  const requestURL = id => `${PRODUCT_SERVICE}seller/store-product/${id}`;
  try {
    // yield delay(10000);
    const cloneCurrent = { ...data };
    if (cloneCurrent.attributes) {
      delete cloneCurrent.attributes;
    }
    yield call(
      request,
      ...[requestURL(data.id), { method: 'put', data: cloneCurrent }],
    );

    if (!ignoreMsgSuccess)
      notification('success', `Sửa sản phẩm ${data?.name} thành công !`);
    yield put(actions.updateListDone({ data, index }));
  } catch (err) {
    yield put(actions.updateListError());
  }
}

function* pushStores({ payload }) {
  const { listData } = payload;
  try {
    const alls = yield all(
      listData.map((item, index) =>
        (function* () {
          try {
            return yield fork(update, { payload: item, isSingle: true, index });
          } catch (e) {
            return e; // **
          }
        })(),
      ),
    );
  } catch (e) {
    // handle fetchAll errors
  }
}

function* pushStoresInList({ payload }) {
  const { listData } = payload;
  try {
    yield all(
      listData.map((item, index) =>
        (function* () {
          try {
            return yield call(update, {
              payload: item,
              isSingle: true,
              index,
            });
            // yield all(
            //   listData.map((item, index) =>
            //     (function* () {
            //       try {
            //         return yield call(update, {
            //           payload: item,
            //           isSingle: true,
            //           index,
            //         });
            //       } catch (e) {
            //         return e; // **
            //       }
            //     })(),
            //   ),
            // );
          } catch (e) {
            if (e?.data?.error_code.includes('CHK_SKU_PROPS_DUPLICATE')) {
              notification(
                'error',
                'Không thể khớp với danh mục của sàn bạn chọn. Vui lòng chọn lại danh mục',
              );
            }
            if (e?.data?.error_code.includes('SellerNotActive')) {
              notification(
                'error',
                'Gian hàng trên Lazada chưa được kích hoạt. Vui lòng kiểm tra và thực hiện lại.',
              );
            }
            return e; // **
          }
        })(),
      ),
    );
    // if (!hasError) {
    //   notification('success', 'Đẩy sản phẩm thành công !');
    //   yield put(actions.pushStoresInListDone());
    //   // yield put(actions.getData(url));
    // } else {
    //   yield put(actions.pushStoresInListError());
    // }
  } catch (err) {
    yield put(actions.pushStoresInListError());
  }
}

export function* pushStore({ payload }) {
  const { index, data } = payload;
  const { platform, store_id, id, name } = data;
  // const requestURL = `/sales-channels-service/${platform}/product/create`;
  const requestURL = `/product-service/seller/store-product/${id}/push-to-store`;

  try {
    const repos = yield call(
      request,
      ...[
        requestURL,
        {
          method: 'post',
          data: { store_id: +store_id, store_product_id: +id },
        },
      ],
    );
    // const repos = {}
    if (repos.is_success) {
      yield put(actions.pushStoreDone({ index, id }));
      notification(
        'success',
        `Sản phẩn ${name} đã được đẩy lên ${platform}`,
        'Thành công !',
      );
    } else {
      yield put(actions.getData('?page=1&page_size=10'));
      yield put(actions.pushStoreError({ index, id }));
    }
  } catch (err) {
    yield put(actions.getData('?page=1&page_size=10'));
    yield put(actions.pushStoreError({ index, err, id }));
    if (err?.data?.error_code.includes('CHK_SKU_PROPS_DUPLICATE')) {
      notification(
        'error',
        'Không thể khớp với danh mục của sàn bạn chọn. Vui lòng chọn lại danh mục',
      );
    }
    if (err?.data?.error_code.includes('SellerNotActive')) {
      notification(
        'error',
        'Gian hàng trên Lazada chưa được kích hoạt. Vui lòng kiểm tra và thực hiện lại.',
      );
    }
  }
}

export function* deleteItem({ payload }) {
  const { id, url } = payload;
  const requestURL = `${PRODUCT_SERVICE}seller/store-product/${id}`;
  try {
    const repos = yield call(request, ...[requestURL, { method: 'delete' }]);
    if (repos) {
      notification('success', 'Xoá thành công!');
      if (url !== undefined) {
        // yield put(actions.getData(url));
      } else {
        const details = yield select(selectDetails);
        const handleDetails = details.filter(item => item.id !== id);
        if (isEmpty(handleDetails)) {
          setTimeout(() => {
            window.location.href = '/selected-products';
          }, 500);
        }
        yield put(actions.setListSelected(handleDetails.map(item => item.id)));
        yield put(actions.getDetailDone(handleDetails));
      }
      yield put(actions.deleteDone(id));
    } else {
      yield put(actions.deleteError());
    }
  } catch (err) {
    notification('error', 'Xoá thất bại!');
    yield put(actions.deleteError());
  }
}

export function* deleteList({ payload }) {
  const { listData, url } = payload;
  const requestURL = id => `${PRODUCT_SERVICE}seller/store-product/${id}`;
  let hasError = false;
  let listDone = [];
  try {
    yield all(
      listData.map(item =>
        (function* () {
          try {
            const data = yield call(
              request,
              ...[requestURL(item), { method: 'delete' }],
            );
            listDone.push(item);
          } catch (e) {
            hasError = true;
            return e; // **
          }
        })(),
      ),
    );
    if (!isEmpty(listDone)) {
      notification('success', 'Xoá thành công');
      yield put(actions.deleteListDone());
      yield put(actions.getData(url));
      // yield put(actions.getData(url));
    } else {
      yield put(actions.deleteListError());
    }
  } catch (err) {
    yield put(actions.deleteListError());
  }
}

export function* duplicateProducts({ payload }) {
  const { listData, url } = payload;
  const requestURL = `${PRODUCT_SERVICE}seller/store-product/duplication-store-product`;
  let listDone = [];
  try {
    yield all(
      listData.map(item =>
        (function* () {
          try {
            yield call(
              request,
              ...[
                requestURL,
                { method: 'post', data: { store_product_id: item } },
              ],
            );
            listDone.push(item);
          } catch (e) {
            return e; // **
          }
        })(),
      ),
    );
    if (!isEmpty(listDone)) {
      notification('success', 'Sao chép sản phẩm thành công');
      yield put(actions.duplicateProductsDone());
      yield put(actions.getData(url));
    } else {
      yield put(actions.duplicateProductsError());
    }
  } catch (err) {
    notification('error', 'Sao chép thất bại!');
    yield put(actions.duplicateProductsError());
  }
}

export function* selectedProductsSaga() {
  yield takeLatest(actions.getData.type, getData);
  yield takeLatest(actions.getDetail.type, getDetail);
  yield takeLatest(actions.update.type, update);
  yield takeLatest(actions.updateList.type, updateList);
  yield takeLatest(actions.delete.type, deleteItem);
  yield takeLatest(actions.deleteList.type, deleteList);
  yield throttle(5000, actions.pushStores.type, pushStores);
  yield takeEvery(actions.pushStore.type, pushStore);
  yield takeEvery(actions.pushStoresInList.type, pushStoresInList);
  yield takeEvery(actions.duplicateProducts.type, duplicateProducts);
}
