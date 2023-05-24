import { createSelector } from '@reduxjs/toolkit';

import { initialState } from '.';

const selectSlice = state => state.selectedProducts || initialState;

export const selectedProducts = createSelector([selectSlice], state => state);

export const selectLoading = createSelector(
  [selectSlice],
  state => state.loading,
);

export const selectShowEmptyPage = createSelector(
  [selectSlice],
  state => state.showEmptyPage,
);

export const selectData = createSelector(
  [selectSlice],
  state => state.data.data,
);
export const selectedTotal = createSelector(
  [selectSlice],
  state => state.data.pagination.total,
);
export const selectListSelected = createSelector(
  [selectSlice],
  state => state.listSelected,
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
export const selectListUpdateDetail = createSelector(
  [selectSlice],
  state => state.listUpdateDetail,
);
