import { createSelector } from '@reduxjs/toolkit';

import { initialState } from '.';

const selectSlice = state => state.products || initialState;

export const selectProducts = createSelector([selectSlice], state => state);

export const selectProductList = createSelector(
  [selectSlice],
  state => state.productList,
);

export const selectPagination = createSelector(
  [selectSlice],
  state => state.pagination,
);

export const selectLoading = createSelector(
  [selectSlice],
  state => state.loading,
);

export const selectLoadingDetail = createSelector(
  [selectSlice],
  state => state.loadingDetail,
);

export const selectDetailId = createSelector(
  [selectSlice],
  state => state.detailId,
);

export const selectIsFirstGetList = createSelector(
  [selectSlice],
  state => state.isFirstGetList,
);

export const selectProductDetail = createSelector(
  [selectSlice],
  state => state.productDetail,
);
