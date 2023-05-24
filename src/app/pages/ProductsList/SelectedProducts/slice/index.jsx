import { createSlice } from 'utils/@reduxjs/toolkit';
import notification from 'utils/notification';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { isEmpty } from 'lodash';
import { selectedProductsSaga } from './saga';

export const initialState = {
  loading: false,
  showEmptyPage: false,
  isFirst: true,
  details: [],
  listStores: [],
  listUpdateDetail: [],
  // listSelected: ['70', '71', '72', '50', '51'],
  listSelected: [],
  data: {
    pagination: {
      page: 1,
      total: 0,
    },
    data: [],
  },
};

const slice = createSlice({
  name: 'selectedProducts',
  initialState,
  reducers: {
    setListSelected(state, action) {
      state.listSelected = action.payload;
    },
    setListStores(state, action) {
      state.listStores = action.payload;
    },
    getData(state, _action) {
      state.loading = !isEmpty(state.data.data) && state.isFirst;
    },
    getDone(state, action) {
      const repos = action.payload;
      state.data = repos;
      if (isEmpty(repos.data) && state.isFirst) {
        state.showEmptyPage = true;
      }
      if (isEmpty(repos.data)) {
        state.loading = false;
      }
      state.isFirst = false;
    },
    getError(state) {
      // state.error = action.payload;
      state.loading = false;
    },

    resetWhenLeave(state) {
      state.isFirst = true;
      state.showEmptyPage = false;
    },
    getDetail(state, _action) {
      state.loading = !(!isEmpty(state.details) && state.isFirst);
      // state.data = {};
    },
    getDetailDone(state, action) {
      const details = action.payload;
      state.details = details;
      state.loading = false;
    },
    getDetailError(state) {
      // state.error = action.payload;
      state.loading = false;
    },
    update(state, _action) {
      state.loading = true;
      // state.data = {};
    },
    updateDone(state, _action) {
      state.loading = false;
    },
    updateError(state, action) {
      // state.error = action.payload;
      const id = action?.payload?.id;
      if (id) {
        state.listUpdateDetail[
          state.listUpdateDetail.findIndex(todo => todo.id === id)
        ].status = 'error';
      } else state.listUpdateDetail = [];
      state.loading = false;
    },
    updateList(state, action) {
      const { data } = action.payload;
      state.listUpdateDetail = [
        {
          id: data.id,
          status: 'loading',
          title: 'Đang cập nhật',
        },
      ];
    },
    updateListDone(state, action) {
      state.listUpdateDetail = [];
      const { index, data } = action.payload;
      state.details[index] = { ...state.details[index], ...data };
    },
    updateListError(state, _state) {
      state.listUpdateDetail = [];
      // state.error = action.payload;
    },

    pushStores(state, action) {
      const { listData } = action.payload;
      state.listUpdateDetail = listData.map(item => ({
        id: item.id,
        status: 'loading',
        title: 'Đang đẩy',
      }));
      if (state.listSelected.length === 1) {
        state.loading = true;
      }
      // state.data = {};
    },
    pushStoresInList(state, action) {
      const { listData } = action.payload;
      state.listUpdateDetail = listData.map(item => ({
        id: item.id,
        status: 'loading',
        title: 'Đang đẩy',
      }));
      if (state.details.length === 1) {
        state.loading = true;
      }
    },
    pushStoresInListDone(_state, _action) {
      // state.loading = false;
    },
    pushStoresInListError(state, _action) {
      // state.error = action.payload;
      state.loading = false;
    },
    duplicateProducts(state, action) {
      // state.loading = true;
      const { listData } = action.payload;
      state.listUpdateDetail = listData.map(id => ({
        id: id,
        status: 'loading',
        title: 'Đang sao chép',
      }));
    },
    duplicateProductsDone(state, _action) {
      state.listUpdateDetail = [];
      state.listSelected = [];
    },
    duplicateProductsError(state, _action) {
      state.listUpdateDetail = [];
      state.listSelected = [];
      state.loading = false;
      // notification('error', 'Vui lòng điền \n thêm thông tin1!');
    },
    delete(state, action) {
      const { id } = action.payload;
      state.listUpdateDetail = [
        {
          id,
          status: 'loading',
          title: 'Đang xoá',
        },
      ];
      state.loading = true;
    },
    deleteDone(state, action) {
      const id = action.payload;
      const indexById = state.details.findIndex(todo => todo.id === id);
      state.listSelected.splice(indexById, 1);
      state.listUpdateDetail[0].status = 'done';
      state.loading = false;
    },
    deleteError(state, _action) {
      // state.error = action.payload;
      state.listUpdateDetail[0].status = 'error';
      state.loading = false;
    },
    deleteList(state, action) {
      const { listData } = action.payload;
      state.listUpdateDetail = listData.map(item => ({
        id: item,
        status: 'loading',
        title: 'Đang xoá',
      }));
      // state.loading = true;
    },
    deleteListDone(state, action) {
      const id = action.payload?.id;
      if (id) {
        state.listUpdateDetail[
          state.listUpdateDetail.findIndex(todo => todo.id === id)
        ].status = 'done';
      } else {
        state.listUpdateDetail = [];
        state.listSelected = [];
      }
      state.loading = false;
    },
    deleteListError(state, action) {
      // state.error = action.payload;
      const id = action.payload?.id;
      if (id) {
        state.listUpdateDetail[
          state.listUpdateDetail.findIndex(todo => todo.id === id)
        ].status = 'error';
      } else {
        state.listUpdateDetail = [];
        state.listSelected = [];
      }
      state.loading = false;
    },
    pushStore(_state, _action) {
      // state.listUpdateDetail = ;
    },
    pushStoreDone(state, action) {
      const { id } = action.payload;
      state.listUpdateDetail[
        state.listUpdateDetail.findIndex(todo => todo.id === id)
      ].status = 'done';
      state.loading = false;
      const indexById = state.details.findIndex(todo => todo.id === id);
      state.details.splice(indexById, 1);
      state.listSelected.splice(indexById, 1);
      notification('success', 'thành công');
      if (state.details.length === 0) {
        setTimeout(() => {
          window.location.href = '/selected-products';
        }, 500);
      }
    },
    pushStoreError(state, action) {
      const { id } = action.payload;
      // debugger;
      const indexById = state.listUpdateDetail.findIndex(
        todo => todo.id === id,
      );

      // state.details.filter((_, i) => i !== index);
      state.listUpdateDetail[indexById].status = 'error';
      state.loading = false;
      // notification('error', 'Vui lòng điền \n thêm thông tin1!');
    },
    clearData(_state) {
      return initialState;
    },
  },
});

export const { actions: productsActions } = slice;

export const useSelectedProductsSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: selectedProductsSaga });
  return { actions: slice.actions };
};
