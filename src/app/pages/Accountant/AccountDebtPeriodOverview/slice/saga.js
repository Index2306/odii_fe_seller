import { call, put, takeLatest, delay } from 'redux-saga/effects';
import { isEmpty } from 'lodash';
import request from 'utils/request';
import { message } from 'antd';
import { AccountDebtPeriodOverviewActions as actions } from '.';
const url = '?page=1&page_size=10';

const ACCOUNTANT_SERVICE = 'oms/accountant';
const USER_SERVICE = 'user-service/';

export function* getData({ payload }) {
  yield delay(500);
  const requestURL = `${ACCOUNTANT_SERVICE}/seller/debt-by-period${payload}`;
  try {
    // Call our request helper (see 'utils/request')
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

export function* getDetail({ payload }) {
  yield delay(500);
  const requestURL = `${USER_SERVICE}admin/partner/transactions/${payload}`;
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

export function* getTransactions({ payload }) {
  yield delay(500);
  const requestURL = `oms/accountant/partner/transactions${payload}&transaction_type=sup_revenue`;
  try {
    // Call our request helper (see 'utils/request')
    const repos = yield call(request, ...[requestURL, {}]);
    if (!isEmpty(repos)) {
      yield put(actions.getTransactionsDone(repos));
    } else {
      yield put(actions.getTransactionsError());
    }
  } catch (err) {
    yield put(actions.getTransactionsError());
  }
}

export function* getTimeline({ payload }) {
  yield delay(500);
  const requestURL = `${USER_SERVICE}transactions/${payload}/timeline`;
  try {
    const repos = yield call(request, ...[requestURL, {}]);
    if (!isEmpty(repos)) {
      yield put(actions.getTimelineDone(repos));
    } else {
      yield put(actions.getTimelineError());
    }
  } catch (err) {
    yield put(actions.getTimelineError());
  }
}

export function* getOverviewStats({ payload }) {
  yield delay(500);
  const requestURL = `${ACCOUNTANT_SERVICE}/seller/overview-stats`;
  try {
    const repos = yield call(request, ...[requestURL, {}]);
    if (!isEmpty(repos)) {
      yield put(actions.getOverviewStatsDone(repos));
    } else {
      yield put(actions.getOverviewStatsError());
    }
  } catch (err) {
    yield put(actions.getOverviewStatsError());
  }
}

export function* getListDebtPeriodTime({ payload }) {
  yield delay(500);
  const requestURL = `${ACCOUNTANT_SERVICE}/debt-period-times`;
  try {
    const repos = yield call(request, ...[requestURL, {}]);
    if (!isEmpty(repos)) {
      yield put(actions.getListDebtPeriodTimeDone(repos));
    } else {
      yield put(actions.getListDebtPeriodTimeError());
    }
  } catch (err) {
    yield put(actions.getListDebtPeriodTimeError());
  }
}

export function* getDebtTimeline({ payload }) {
  yield delay(500);
  const requestURL = `${USER_SERVICE}debt/${payload.id}/timeline`;
  try {
    const repos = yield call(request, ...[requestURL, {}]);
    if (!isEmpty(repos)) {
      yield put(actions.getDebtTimelineDone(repos));
    } else {
      yield put(actions.getDebtTimelineError());
    }
  } catch (err) {
    yield put(actions.getDebtTimelineError());
  }
}

export function* updateDebtProgress({ payload }) {
  yield delay(500);
  const requestURL = `oms/accountant/partner/debt/${payload.id}/update-progress`;
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
      yield put(actions.updateDebtProgressDone(repos));
      if (payload.onSuccessCallback) payload.onSuccessCallback(repos.data);
    } else {
      yield put(actions.updateDebtProgressError());
    }
  } catch (err) {
    yield put(actions.updateDebtProgressError());
  }
}

export function* AccountDebtPeriodOverviewSaga() {
  yield takeLatest(actions.getData.type, getData);
  yield takeLatest(actions.getDetail.type, getDetail);
  yield takeLatest(actions.getData.type, getOverviewStats);
  yield takeLatest(actions.getListDebtPeriodTime.type, getListDebtPeriodTime);
  yield takeLatest(actions.getTransactions.type, getTransactions);
  yield takeLatest(actions.getTimeline.type, getTimeline);
  yield takeLatest(actions.getDebtTimeline.type, getDebtTimeline);
  yield takeLatest(actions.updateDebtProgress.type, updateDebtProgress);
}
