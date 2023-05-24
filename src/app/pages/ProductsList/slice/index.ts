import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { selectedProductsSaga } from './saga';
import { SelectedProductsState } from './types';

export const initialState: SelectedProductsState = {
  loading: false,
  details: [],
  listStores: [],
  listSelected: [],
  data: {
    pagination: {
      page: 1,
      total: 0,
    },
    data: [],
  },
};

const slice = createSlice({
  name: 'selectedProducts',
  initialState,
  reducers: {
    setListSelected(state, action: PayloadAction) {
      state.listSelected = action.payload;
    },
    setListStores(state, action: PayloadAction) {
      state.listStores = action.payload;
    },
    getData(state, _action: PayloadAction) {
      state.loading = true;
      // state.data = {};
    },
    getDone(state, action: PayloadAction) {
      const repos = action.payload;
      state.data = repos;
      state.loading = false;
    },
    getError(state) {
      // state.error = action.payload;
      state.loading = false;
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
  },
});

export const { actions: productsActions } = slice;

export const useSelectedProductsSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: selectedProductsSaga });
  return { actions: slice.actions };
};
