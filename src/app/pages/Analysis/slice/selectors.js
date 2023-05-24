import { createSelector } from '@reduxjs/toolkit';

import { initialState } from '.';

const selectSlice = state => state.analysis || initialState;

export const selectAnalysis = createSelector([selectSlice], state => state);

export const selectLoading = createSelector(
  [selectSlice],
  state => state.loading,
);

export const selectListStores = createSelector(
  [selectSlice],
  state => state.listStores,
);
