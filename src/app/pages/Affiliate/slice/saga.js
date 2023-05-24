import { call, put, takeLatest, delay } from 'redux-saga/effects';
import { isEmpty } from 'lodash';
import request from 'utils/request';
import { message } from 'antd';
import { affiliateActions as actions } from '.';

const USER_SERVICE = 'user-service/';
// const url = '?page=1&page_size=10';

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

export function* getDataListSeller({ payload }) {
  yield delay(500);
  const requestURL = `${USER_SERVICE}partner-affiliate/me/list-seller${payload}`;
  try {
    const repos = yield call(request, ...[requestURL, {}]);
    if (!isEmpty(repos)) {
      yield put(actions.getDataListSellerDone(repos));
    } else {
      yield put(actions.getDataError());
    }
  } catch (err) {
    yield put(actions.getDataError());
  }
}

export function* getDataListPayout({ payload }) {
  yield delay(500);
  const requestURL = `${USER_SERVICE}partner-affiliate/list-payout`;

  try {
    const repos = yield call(request, ...[requestURL, {}]);
    if (!isEmpty(repos)) {
      yield put(actions.getDataListPayoutDone(repos));
    } else {
      yield put(actions.getDataError());
    }
  } catch (err) {
    yield put(actions.getDataError());
  }
}
export function* getDataListCommission({ payload }) {
  yield delay(500);
  const requestURL = `${USER_SERVICE}partner-affiliate/me/list-commission${payload}`;
  // const requestURL = `${USER_SERVICE}partner-affiliate/me/list-seller`;

  try {
    const repos = yield call(request, ...[requestURL, {}]);
    if (!isEmpty(repos)) {
      yield put(actions.getDataListCommissionDone(repos));
    } else {
      yield put(actions.getDataError());
    }
  } catch (err) {
    yield put(actions.getDataError());
  }
}

export function* getDataAffiliateCode({ payload }) {
  yield delay(500);
  const requestURL = `${USER_SERVICE}partner-affiliate/me`;
  try {
    const repos = yield call(request, ...[requestURL]);

    if (!isEmpty(repos)) {
      yield put(actions.getDataAffiliateCodeDone(repos));
    } else {
      yield put(actions.getDataError());
    }
  } catch (err) {
    yield put(actions.getDataError());
  }
}

export function* getDataStatisticalAffiliate({ payload }) {
  yield delay(500);
  const requestURL = `${USER_SERVICE}statistical-affiliate-periods`;
  try {
    const repos = yield call(request, ...[requestURL, {}]);
    if (!isEmpty(repos)) {
      yield put(actions.getDataStatisticalAffiliateDone(repos));
    } else {
      yield put(actions.getDataError());
    }
  } catch (err) {
    yield put(actions.getDataError());
  }
}

export function* verifyAffiliate({ payload }) {
  const requestURL = `${USER_SERVICE}partner-affiliate/me/verify`;
  try {
    const repos = yield call(
      request,
      ...[requestURL, { method: 'post', data: payload.data }],
    );
    message.success(
      'Tham gia chương trình tiếp thị đối tác bán hàng Affiliate !',
    );
    if (!isEmpty(repos)) {
      yield put(actions.verifyAffiliateDone());
      yield put(actions.getDataAffiliateCode());
    } else {
      yield put(actions.verifyAffiliateError());
    }
  } catch (err) {
    yield put(actions.verifyAffiliateError());
  }
}

export function* affiliateSaga() {
  // yield takeLatest(actions.getData.type, getData);
  yield takeLatest(actions.getDetail.type, getDetail);
  yield takeLatest(actions.getDataListSeller.type, getDataListSeller);
  yield takeLatest(actions.getDataListPayout.type, getDataListPayout);
  yield takeLatest(actions.getDataListCommission.type, getDataListCommission);
  yield takeLatest(actions.getDataAffiliateCode.type, getDataAffiliateCode);
  yield takeLatest(
    actions.getDataStatisticalAffiliate.type,
    getDataStatisticalAffiliate,
  );
  yield takeLatest(actions.verifyAffiliate.type, verifyAffiliate);
}
