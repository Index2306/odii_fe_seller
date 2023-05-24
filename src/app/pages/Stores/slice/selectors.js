import { createSelector } from '@reduxjs/toolkit';

import { initialState } from '.';

const selectSlice = state => state.stores || initialState;

export const selectStores = createSelector(
  [selectSlice],
  state => state.stores,
);

export const selectLoading = createSelector(
  [selectSlice],
  state => state.loading,
);

export const selectShowEmptyPage = createSelector(
  [selectSlice],
  state => state.showEmptyPage,
);

export const selectIsFirstGetList = createSelector(
  [selectSlice],
  state => state.isFirstGetList,
);
export const selectProductList = createSelector(
  [selectSlice],
  state => state.productList,
);
export const selectDetailId = createSelector(
  [selectSlice],
  state => state.detailId,
);
export const selectLoadingDetail = createSelector(
  [selectSlice],
  state => state.loadingDetail,
);
export const selectProductPagination = createSelector(
  [selectSlice],
  state => state.productPagination,
);
