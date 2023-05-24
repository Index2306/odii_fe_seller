import { createSelector } from '@reduxjs/toolkit';

import { initialState } from '.';

const selectSlice = state => state.sellingProducts || initialState;

export const sellingProducts = createSelector([selectSlice], state => state);

export const selectLoading = createSelector(
  [selectSlice],
  state => state.loading,
);

export const selectData = createSelector(
  [selectSlice],
  state => state.data.data,
);
export const selectTotal = createSelector(
  [selectSlice],
  state => state.data.pagination.total,
);
export const selectListSelling = createSelector(
  [selectSlice],
  state => state.listSelling,
);
export const selectListStores = createSelector(
  [selectSlice],
  state => state.listStores,
);
export const selectPagination = createSelector(
  [selectSlice],
  state => state.data.pagination,
);
export const selectDetails = createSelector(
  [selectSlice],
  state => state.details,
);

export const selectShowEmptyPage = createSelector(
  [selectSlice],
  state => state.showEmptyPage,
);
