import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { productsSaga } from './saga';
import { ProductsState } from './types';

export const initialState: ProductsState = {
  productList: [],
  detailId: '',
  loading: false,
  loadingDetail: false,
  isFirstGetList: true,
  pagination: {},
  productDetail: null,
};

const slice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    getProductList(state, _action: PayloadAction<any>) {
      state.productList = [];
      state.pagination = {};
      state.loading = true;
    },
    getProductListDone(state, action: PayloadAction<any>) {
      state.productList = action.payload.data;
      state.pagination = action.payload.pagination;
      state.loading = false;
      state.isFirstGetList = false;
    },
    getProductListError(state, _action: PayloadAction<any>) {
      state.productList = [];
      state.pagination = {};
      state.loading = false;
    },

    setDetailId(state, action: PayloadAction<any>) {
      state.detailId = action.payload;
    },

    getProductDetail(state, _action: PayloadAction<any>) {
      state.productDetail = null;
      state.loadingDetail = true;
    },
    getProductDetailDone(state, action: PayloadAction<any>) {
      state.productDetail = action.payload.data;
      state.loadingDetail = false;
    },
    getProductDetailError(state, _action: PayloadAction<any>) {
      state.productDetail = null;
      state.loadingDetail = false;
    },
  },
});

export const { actions: productsActions } = slice;

export const useProductsSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: productsSaga });
  return { actions: slice.actions };
};
