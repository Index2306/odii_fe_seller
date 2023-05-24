import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { isEmpty } from 'lodash';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { sellingProductsSaga } from './saga';
import { SellingProductsState } from './types';

export const initialState: SellingProductsState = {
  loading: false,
  details: [],
  listStores: [],
  listSelling: [],
  showEmptyPage: false,
  isFirst: true,
  data: {
    pagination: {
      page: 1,
      total: 0,
    },
    data: [],
  },
};

const slice = createSlice({
  name: 'sellingProducts',
  initialState,
  reducers: {
    setListSelling(state, action: PayloadAction) {
      state.listSelling = action.payload;
    },
    setListStores(state, action: PayloadAction) {
      state.listStores = action.payload;
    },
    getData(state, _action: PayloadAction) {
      state.loading = !(!isEmpty(state.data.data) && state.isFirst);
    },
    getDone(state, action: PayloadAction) {
      const repos: any = action.payload;
      state.data = repos;
      if (isEmpty(repos?.data) && state.isFirst) {
        state.showEmptyPage = true;
      }
      state.isFirst = false;
      state.loading = false;
    },
    getError(state) {
      // state.error = action.payload;
      state.loading = false;
    },
    resetWhenLeave(state) {
      state.isFirst = true;
      state.showEmptyPage = false;
    },
    getDetail(state, _action: PayloadAction) {
      state.loading = true;
      // state.data = {};
    },
    getDetailDone(state, action: PayloadAction) {
      const details = action.payload;
      state.details = details;
      state.loading = false;
    },
    getDetailError(state) {
      // state.error = action.payload;
      state.loading = false;
    },
    update(state, _action: PayloadAction) {
      state.loading = true;
      // state.data = {};
    },
    updateDone(state, _action: PayloadAction) {
      state.loading = false;
    },
    updateError(state) {
      // state.error = action.payload;
      state.loading = false;
    },
    delete(state, _action: PayloadAction) {
      state.loading = true;
      // state.data = {};
    },
    deleteDone(state, _action: PayloadAction) {
      state.loading = false;
    },
    deleteError(state) {
      // state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { actions: productsActions } = slice;

export const useSellingProductsSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: sellingProductsSaga });
  return { actions: slice.actions };
};
