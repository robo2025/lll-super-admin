import { getSupplierInfo, getUserInfo } from '../services/user';
import { SUCCESS_STATUS } from '../constant/config.js';

export default {
  namespace: 'user',

  state: {
    list: [],
    info: {},
    loading: false,
    currentUser: {},
    supplier: {},
  },

  effects: {
    *fetch({ success, error }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(getUserInfo);
      if (response.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') { success(response); }
      } else if (typeof error === 'function') { error(response); return; }

      yield put({
        type: 'save',
        payload: response.data,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *fetchSupplierInfo({ supplierid }, { call, put }) {
      const response = yield call(getSupplierInfo, supplierid);
      yield put({
        type: 'saveSupplier',
        payload: response.data,
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        info: action.payload,
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload,
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload,
        },
      };
    },
    saveSupplier(state, action) {
      return {
        ...state,
        supplier: action.payload,
      };
    },
  },
};
