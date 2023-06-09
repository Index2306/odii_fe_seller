import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

const selectSlice = (state: RootState) => state.auth || initialState;

export const selectAuth = createSelector([selectSlice], state => state);

export const selectAccessToken = createSelector(
  [selectSlice],
  auth => auth.accessToken,
);
export const selectLoading = createSelector(
  [selectSlice],
  auth => auth.loading,
);
