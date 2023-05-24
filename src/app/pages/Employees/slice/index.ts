import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { isEmpty } from 'lodash';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { employeesSaga } from './saga';
import { EmployeesState } from './types';

export const initialState: EmployeesState = {
  loading: false,
  showEmptyPage: false,
  isFirst: true,
  detail: {},
  data: {
    pagination: {
      page: 1,
      total: 0,
    },
    data: [],
  },
  dataRole: {},
  dataStoreIds: {},
  listSelected: [],
};

const slice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    setListSelected(state, action) {
      state.listSelected = action.payload;
    },

    getData(state, _action) {
      // state.loading = !(!isEmpty(state.data.data) && state.isFirst);
      state.loading = isEmpty(state.data.data);
    },
    getDone(state, action) {
      const repos = action.payload;
      state.data = repos;
      if (isEmpty(repos.data) && state.isFirst) {
        state.showEmptyPage = true;
      }
      state.isFirst = false;
      state.loading = false;
    },
    getError(state) {
      state.loading = false;
    },

    resetWhenLeave(state) {
      state.isFirst = true;
      state.showEmptyPage = false;
    },
    getDataRole(state, _action: PayloadAction) {
      // state.loading = true;
    },
    getDataRoleDone(state, action: PayloadAction) {
      const repos = action.payload;
      state.dataRole = repos;
      state.loading = false;
    },
    getDataRoleError(state) {
      state.loading = false;
    },

    getDataStoreIds(state, _action: PayloadAction) {
      // state.loading = true;
    },
    getDataStoreIdsDone(state, action: PayloadAction) {
      const repos = action.payload;
      state.dataStoreIds = repos;
      state.loading = false;
    },
    getDataStoreIdsError(state) {
      state.loading = false;
    },

    getDetail(state, _action: PayloadAction) {
      state.loading = true;
      // state.data = {};
    },
    getDetailDone(state, action: PayloadAction) {
      const detail = action.payload;
      state.detail = detail;
      state.loading = false;
    },
    getDetailError(state) {
      // state.error = action.payload;
      state.loading = false;
    },

    updateUser(state, _action: PayloadAction) {
      state.loading = true;
      // state.data = {};
    },

    updateStatusUser(state, _action: PayloadAction) {
      state.loading = true;
      // state.data = {};
    },

    inviteUser(state, _action: PayloadAction) {
      state.loading = true;
    },
    inviteUserDone(state, action: PayloadAction) {
      const repos = action.payload;
      state.data = repos;
      state.loading = false;
    },
    inviteUserError(state) {
      state.loading = false;
    },

    deleteEmployee(state, _action: PayloadAction) {
      state.loading = true;
    },
    deleteEmployeeDone(state, action: PayloadAction) {
      // const repos = action.payload;
      // state.data = repos;
      state.loading = false;
    },
    deleteEmployeeError(state) {
      state.loading = false;
    },
  },
});

export const { actions: employeesActions } = slice;

export const useEmployeesSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: employeesSaga });
  return { actions: slice.actions };
};
