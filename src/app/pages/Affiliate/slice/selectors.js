import { createSelector } from '@reduxjs/toolkit';

import { initialState } from '.';

const selectSlice = state => state.affiliate || initialState;

export const selectAffiliate = createSelector([selectSlice], state => state);

export const selectLoading = createSelector(
  [selectSlice],
  state => state.loading,
);

// export const selectData = createSelector(
//   [selectSlice],
//   state => state.data.data,
// );

export const selectDataListSeller = createSelector(
  [selectSlice],
  state => state.dataListSeller.data,
);

export const selectDataListCommission = createSelector(
  [selectSlice],
  state => state.dataListCommission.data,
);

export const selectShowEmptyPageListSeller = createSelector(
  [selectSlice],
  state => state.showEmptyPageSeller,
);
export const selectShowEmptyPageCommission = createSelector(
  [selectSlice],
  state => state.showEmptyPageCommission,
);
export const selectListSelected = createSelector(
  [selectSlice],
  state => state.listSelected,
);

export const selectDataAffiliateCode = createSelector([selectSlice], state => {
  const dataAffiliateCode = state.dataAffiliateCode.data;
  return dataAffiliateCode;
});
export const selectDataStatisticalAffiliate = createSelector(
  [selectSlice],
  state => {
    const dataStatisticalAffiliate = state.dataStatisticalAffiliate.data;
    return dataStatisticalAffiliate;
  },
);
export const selectDataListPayout = createSelector([selectSlice], state => {
  const dataListPayout = state.dataListPayout.data;
  return dataListPayout;
});

export const selectPaginationListSeller = createSelector(
  [selectSlice],
  state => state.dataListSeller.pagination,
);
export const selectPaginationListCommission = createSelector(
  [selectSlice],
  state => state.dataListCommission.pagination,
);

export const selectDetail = createSelector(
  [selectSlice],
  state => state.detail.data,
);
// export const selectTimeline = createSelector(
//   [selectSlice],
//   state => state.timeline.data,
// );
