import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { authSaga } from './saga';
import { AuthState, RepoErrorType } from './types';

export const initialState: AuthState = {
  loading: false,
  accessToken: null,
  error: null,
  repositories: {},
  isUserActived: false,
};

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signin(state, _action) {
      state.error = null;
      state.repositories = {};
    },
    signinDone(state, action) {
      const response = action.payload;
      state.accessToken = response.access_token;
    },
    signinError(state, action) {
      state.error = action.payload;
    },

    signup(state, _action) {
      state.error = null;
      state.repositories = {};
    },
    signupDone(state, action) {
      const repos = action.payload;
      state.repositories = repos;
    },
    signupError(state, action) {
      state.error = action.payload;
    },

    changepass(state, _action: PayloadAction<object>) {
      state.loading = true;
      state.error = null;
      state.repositories = {};
    },
    changepassDone(state, action: PayloadAction<object>) {
      const repos = action.payload;
      state.repositories = repos;
      state.loading = false;
    },
    changepassError(state, action: PayloadAction<RepoErrorType>) {
      state.error = action.payload;
      state.loading = false;
    },

    forgotpass(state, _action: PayloadAction<object>) {
      state.error = null;
      state.repositories = {};
    },
    forgotpassDone(state, action: PayloadAction<object>) {
      const repos = action.payload;
      state.repositories = repos;
    },
    forgotpassError(state, action: PayloadAction<RepoErrorType>) {
      state.error = action.payload;
    },
  },
});

export const { actions: authActions, reducer } = slice;

export const useAuthSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: authSaga });
  return { actions: slice.actions };
};

/**
 * Example Usage:
 *
 * export function MyComponentNeedingThisSlice() {
 *  const { actions } = useAuthSlice();
 *
 *  const onButtonClick = (evt) => {
 *    dispatch(actions.someAction());
 *   };
 * }
 */
