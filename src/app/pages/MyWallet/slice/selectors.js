import { createSelector } from '@reduxjs/toolkit';

import { initialState } from '.';

const selectSlice = state => state.mywallet || initialState;

export const selectMyWallet = createSelector([selectSlice], state => state);

export const selectLoading = createSelector(
  [selectSlice],
  state => state.loading,
);

export const selectShowEmptyPage = createSelector(
  [selectSlice],
  state => state.showEmptyPage,
);

export const selectData = createSelector([selectSlice], state => {
  const data = state.data.data;
  return data;
});

export const selectDataBalance = createSelector([selectSlice], state => {
  const dataBalance = state.dataBalance.data;
  return dataBalance;
});

export const selectDataNearest = createSelector([selectSlice], state => {
  const dataNearest = state.dataBalance.nearest;
  return dataNearest;
});

export const selectDataBank = createSelector([selectSlice], state => {
  const dataBankAdmin = state.dataBankAdmin.data;
  return dataBankAdmin;
});

export const selectDataBankSeller = createSelector([selectSlice], state => {
  const dataBankSeller = state.dataBankSeller.data;
  return dataBankSeller;
});

export const selectDataCreateBankTransaction = createSelector(
  [selectSlice],
  state => {
    const dataCreaterTransaction = state.dataCreaterTransaction.data;
    return dataCreaterTransaction;
  },
);
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
