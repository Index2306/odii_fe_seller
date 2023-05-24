import { createSlice } from 'utils/@reduxjs/toolkit';
import notification from 'utils/notification';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { isEmpty } from 'lodash';
import { analysisSaga } from './saga';

export const initialState = {
  loading: false,
  showEmptyPage: false,
  isFirst: true,
  listStores: [],
};

const slice = createSlice({
  name: 'analysis',
  initialState,
  reducers: {
    setListStores(state, action) {
      state.listStores = action.payload;
    },
    clearData(_state) {
      return initialState;
    },
  },
});

export const { actions: analysisActions } = slice;

export const useAnalysisSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: analysisSaga });
  return { actions: slice.actions };
};
