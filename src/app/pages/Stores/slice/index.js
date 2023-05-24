import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { isEmpty } from 'lodash';
import { storesSaga } from './saga';

export const initialState = {
  stores: [],
  pagination: {},
  loading: false,
  isFirst: true,
  showEmptyPage: false,
  productList: [],
  productPagination: { page: 1, total: 0 },
  detailId: '',
  loadingDetail: false,
  isFirstGetList: true,
};

const slice = createSlice({
  name: 'stores',
  initialState,
  reducers: {
    getProductList(state, _action) {
      // state.productList = [];
      // state.productPagination = {};
      state.loading = true;
    },
    getProductListV2(state, _action) {
      // state.productList = [];
      // state.productPagination = {};
      state.loading = true;
    },
    setLoading(state, action) {
      // state.productList = [];
      // state.productPagination = {};
      state.loading = action.payload;
    },
    getProductListDone(state, action) {
      state.productList = action.payload.data;
      state.productPagination = action.payload.pagination;
      state.loading = false;
      state.isFirstGetList = false;
    },
    getProductListError(state, _action) {
      // state.productList = [];
      // state.productPagination = initialState.productPagination;
      state.loading = false;
    },

    getStoresList(state, action) {
      state.loading = !(!isEmpty(state.stores) && state.isFirst);
    },
    getStoresListDone(state, action) {
      state.stores = action.payload.data;
      state.pagination = action.payload.pagination;
      if (isEmpty(action.payload.data) && state.isFirst) {
        state.showEmptyPage = true;
      }
      state.isFirst = false;
      state.loading = false;
    },
    getStoresListError(state, action) {
      state.stores = [];
      state.pagination = {};
      state.loading = false;
    },
    updateTypeConnect(state, _action) {
      state.loading = true;
      // state.data = {};
    },
    updateTypeConnectDone(state, _action) {
      state.loading = false;
    },
    updateTypeConnectError(state) {
      // state.error = action.payload;
      state.loading = false;
    },
    resetWhenLeave(state) {
      state.isFirst = true;
      state.showEmptyPage = false;
    },
  },
});

export const { actions: storesActions } = slice;

export const useStoresSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: storesSaga });
  return { actions: slice.actions };
};
