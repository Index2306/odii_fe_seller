// import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { mywalletSaga } from './saga';
import { MyWalletState } from './types';
import { isEmpty } from 'lodash';

export const initialState: MyWalletState = {
  loading: false,
  showEmptyPage: false,
  isFirst: true,
  isFirstBank: true,
  detail: {},
  data: {
    pagination: {
      page: 1,
      total: 0,
    },
    data: [],
  },
  dataBankAdmin: [],
  dataBankSeller: [],
  dataCreaterTransaction: [],
  dataBalance: [],
  timeline: {},
};

const slice = createSlice({
  name: 'mywallet',
  initialState,
  reducers: {
    getData(state, _action) {
      state.loading = isEmpty(state.data.data);
    },
    getDone(state, action) {
      const repos = action.payload;
      state.data = repos;
      if (!isEmpty(repos.data)) {
        state.showEmptyPage = false;
      }
      if (isEmpty(repos.data) && state.isFirst) {
        state.showEmptyPage = true;
      }
      state.isFirst = false;
      state.loading = false;
    },
    getError(state) {
      // state.error = action.payload;
      state.loading = false;
    },

    setShowEmptyPage(state, action) {
      // state.error = action.payload;
      state.showEmptyPage = action.payload;
    },
    clearEmptyPage(state) {
      state.showEmptyPage = false;
    },
    resetWhenLeave(state) {
      state.showEmptyPage = false;
    },

    getBalance(state, _action) {
      state.loading = true;
      // state.data = {};
    },
    getBalanceDone(state, action) {
      const repos = action.payload;
      state.dataBalance = repos;
      state.loading = false;
    },
    getBalanceError(state) {
      // state.error = action.payload;
      state.loading = false;
    },

    getDataBank(state, _action) {
      state.loading = true;
      // state.data = {};
    },
    getDataBankDone(state, action) {
      const repos = action.payload;
      state.dataBankAdmin = repos;
      state.loading = false;
    },
    getDataBankError(state) {
      // state.error = action.payload;
      state.loading = false;
    },

    //get All Bank Seller
    getBankSeller(state, _action) {
      state.loading = true;
    },
    getBankSellerDone(state, action) {
      const repos = action.payload;
      state.dataBankSeller = repos;
      // if (!isEmpty(repos.data)) {
      //   state.showEmptyPage = false;
      // }
      // if (isEmpty(repos.data) && state.isFirstBank) {
      //   state.showEmptyPage = true;
      // }
      state.isFirstBank = false;
      state.loading = false;
    },
    getBankSellerError(state) {
      state.loading = false;
    },

    //Seller Add Bank
    SellerAddBank(state, _action) {
      state.loading = true;
      // state.data = {};
    },
    SellerAddBankDone(state, action) {
      const repos = action.payload;
      // state.data = repos;
      state.loading = false;
    },
    SellerAddBankError(state) {
      // state.error = action.payload;
      state.loading = false;
    },

    //Seller Update Bank
    SellerUpdateBank(state, _action) {
      state.loading = true;
      // state.data = {};
    },
    SellerUpdateBankDone(state, action) {
      // const repos = action.payload;
      // state.data = repos;
      state.loading = false;
    },
    SellerUpdateBankError(state) {
      // state.error = action.payload;
      state.loading = false;
    },

    // Create Withdrawal
    createBankTransactionWithdrawal(state, _action) {
      // state.loading = true;
      // state.data = {};
    },

    // Create Deposit
    createBankTransaction(state, _action) {
      // state.loading = true;
      // state.data = {};
    },
    getDataCreateBankTransactionDone(state, action) {
      const repos = action.payload;
      state.dataCreaterTransaction = repos;
      state.loading = false;
    },
    getDataCreateBankTransactionError(state) {
      // state.error = action.payload;
      state.loading = false;
    },

    setStatusPending(state, _action) {
      // state.loading = true;
      // state.data = {};
    },
    setStatusPendingDone(state, action) {
      const repos = action.payload;
      // state.dataBank = repos;
      // state.loading = false;
    },
    setStatusPendingError(state) {
      // state.error = action.payload;
      // state.loading = false;
    },
    setStatusPendingList(state, _action) {
      state.loading = true;
      // state.data = {};
    },
    setStatusPendingListDone(state, action) {
      const repos = action.payload;
      // state.dataBank = repos;
      state.loading = false;
    },
    setStatusPendingListError(state) {
      // state.error = action.payload;
      state.loading = false;
    },
    setStatusPendingWithdrawal(state, _action) {
      state.loading = true;
      // state.data = {};
    },

    deleteTransaction(state, _action) {
      state.loading = true;
      // state.data = {};
    },
    getDetail(state, _action) {
      state.loading = true;
      // state.data = {};
    },
    getDetailDone(state, action) {
      const detail = action.payload;
      state.detail = detail;
      state.loading = false;
    },
    getDetailError(state) {
      // state.error = action.payload;
      state.loading = false;
    },

    getTimeline(state, _action) {
      state.loading = true;
    },
    getTimelineDone(state, action) {
      const timeline = action.payload;
      state.timeline = timeline;
      state.loading = false;
    },
    getTimelineError(state) {
      // state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { actions: mywalletActions } = slice;

export const useMyWalletSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: mywalletSaga });
  return { actions: slice.actions };
};
