import { createSelector } from '@reduxjs/toolkit';

import { initialState } from '.';

const selectSlice = state => state.employees || initialState;

export const selectEmployees = createSelector([selectSlice], state => state);

export const selectLoading = createSelector(
  [selectSlice],
  state => state.loading,
);

export const selectData = createSelector([selectSlice], state => {
  const temp = state.data.data;
  const objOwner = temp?.filter(item => item.is_owner === true);
  const arrayUser = temp?.filter(item => item.is_owner === false);
  const data = objOwner?.concat(arrayUser);
  return data;
});

export const selectListSelected = createSelector(
  [selectSlice],
  state => state.listSelected,
);

export const selectDataRole = createSelector([selectSlice], state => {
  const dataRole = state.dataRole.data;
  return dataRole;
});
export const selectDataStoreIds = createSelector([selectSlice], state => {
  const dataStoreIds = state.dataStoreIds.data;
  return dataStoreIds;
});

export const selectPagination = createSelector(
  [selectSlice],
  state => state.data.pagination,
);
export const selectDetail = createSelector(
  [selectSlice],
  state => state.detail.data,
);
export const selectTimeline = createSelector(
  [selectSlice],
  state => state.timeline.data,
);
