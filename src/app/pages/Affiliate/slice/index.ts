import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { isEmpty } from 'lodash';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { affiliateSaga } from './saga';
import { AffiliateState } from './types';

export const initialState: AffiliateState = {
  loading: false,
  showEmptyPageSeller: false,
  showEmptyPageCommission: false,
  isFirstSeller: true,
  isFirstCommission: true,
  detail: {},
  dataListSeller: {
    pagination: {
      page: 1,
      total: 0,
    },
    data: [],
  },
  dataListCommission: {
    pagination: {
      page: 1,
      total: 0,
    },
    data: [],
  },
  dataAffiliateCode: [],
  dataStatisticalAffiliate: [],
  dataListPayout: [],
  listSelected: [],
};

const slice = createSlice({
  name: 'affiliate',
  initialState,
  reducers: {
    setListSelected(state, action) {
      state.listSelected = action.payload;
    },

    getDataListSeller(state, _action) {
      // state.loading = !(!isEmpty(state.data.data) && state.isFirst);
      state.loading = isEmpty(state.dataListSeller.data);
    },
    getDataListSellerDone(state, action) {
      const repos = action.payload;
      state.dataListSeller = repos;
      if (isEmpty(repos.data) && state.isFirstSeller) {
        state.showEmptyPageSeller = true;
      }
      state.isFirstSeller = false;
      state.loading = false;
    },

    getDataListCommission(state, _action) {
      // state.loading = !(!isEmpty(state.data.data) && state.isFirst);
      state.loading = isEmpty(state.dataListCommission.data);
    },
    getDataListCommissionDone(state, action) {
      const repos = action.payload;
      state.dataListCommission = repos;
      if (isEmpty(repos.data) && state.isFirstCommission) {
        state.showEmptyPageCommission = true;
      }
      state.isFirstCommission = false;
      state.loading = false;
    },

    getDataError(state) {
      state.loading = false;
    },

    resetWhenLeave(state) {
      state.isFirstSeller = true;
      state.isFirstCommission = true;
      state.showEmptyPageSeller = false;
      state.showEmptyPageCommission = false;
    },

    getDetail(state, _action: PayloadAction) {
      state.loading = true;
      // state.data = {};
    },
    getDetailDone(state, action: PayloadAction) {
      const detail = action.payload;
      state.detail = detail;
      state.loading = false;
    },
    getDetailError(state) {
      // state.error = action.payload;
      state.loading = false;
    },

    getDataListPayout(state, _action: PayloadAction) {
      // state.loading = true;
    },
    getDataListPayoutDone(state, action: PayloadAction) {
      const repos = action.payload;
      state.dataListPayout = repos;
      // state.loading = false;
    },

    getDataAffiliateCode(state, _action: PayloadAction) {
      // state.loading = true;
    },
    getDataAffiliateCodeDone(state, action: PayloadAction) {
      const repos = action.payload;
      state.dataAffiliateCode = repos;
      // state.loading = false;
    },

    getDataStatisticalAffiliate(state, _action) {
      state.loading = isEmpty(state.dataStatisticalAffiliate.data);
    },
    getDataStatisticalAffiliateDone(state, action) {
      const repos = action.payload;
      state.dataStatisticalAffiliate = repos;
      state.loading = false;
    },

    verifyAffiliate(state, _action: PayloadAction) {
      state.loading = true;
    },
    verifyAffiliateDone(state, action: PayloadAction) {
      // const repos = action.payload;
      // state.data = repos;
      state.loading = false;
    },
    verifyAffiliateError(state) {
      state.loading = false;
    },
  },
});

export const { actions: affiliateActions } = slice;

export const useAffiliateSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: affiliateSaga });
  return { actions: slice.actions };
};
