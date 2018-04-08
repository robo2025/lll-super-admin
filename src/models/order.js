import {
  queryOrders,
  queryDelivery,
  queryExceptionOrders,
  queryDelayException,
  queryOrderDetail,
  queryCancelOrder,
  queryAgreeNoGood,
  queryRejectNoGood,
  queryAgreeDelay,
  queryRejectDelay,
  queryPayment,
} from '../services/order';
import { SUCCESS_STATUS } from '../constant/config.js';

export default {
  namespace: 'orders',

  state: {
    list: [],
    exceptionList: [],
    detail: {},
    offset: 0,
    limit: 15,
    total: 0,
  },

  effects: {
    *fetchDetail({ orderId, success, error }, { call, put }) {
      const res = yield call(queryOrderDetail, { orderId });
      if (res.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') success(res);
      } else if (typeof error === 'function') { error(res); return; }

      yield put({
        type: 'saveDetail',
        payload: res.data,
      });
    },
    *fetchDelayException({ orderId, data, success, error }, { call, put }) {
      const res = yield call(queryDelayException, { orderId, data });
      if (res.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') success(res);
      } else if (typeof error === 'function') { error(res); return; }

      const response = yield call(queryOrderDetail, { orderId });      
      yield put({
        type: 'saveDetail',
        payload: response.data,
      });
    },
    *fetchDelivery({ orderId, data, success, error }, { call, put }) {
      const res = yield call(queryDelivery, { orderId, data });
      if (res.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') success(res);
      } else if (typeof error === 'function') { error(res); return; }

      const response = yield call(queryOrderDetail, { orderId });      
      yield put({
        type: 'saveDetail',
        payload: response.data,
      });
    },
    *fetchCancel({ orderId, data, success, error }, { call, put }) {
      const res = yield call(queryCancelOrder, { orderId, data });
      if (res.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') success(res);
      } else if (typeof error === 'function') { error(res); return; }

      const response = yield call(queryOrders, {});
      const { headers } = response;      
      yield put({
        type: 'save',
        payload: response.data,
        headers,
      });
    },
    *fetchAgreeNoGood({ orderId, data, success, error }, { call, put }) {
      const res = yield call(queryAgreeNoGood, { orderId, data });
      if (res.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') success(res);
      } else if (typeof error === 'function') { error(res); return; }

      const response = yield call(queryExceptionOrders, {});
      const { headers } = response;      
      yield put({
        type: 'saveException',
        payload: response.data,
        headers,
      });
    },
    *fetchRejectNoGood({ orderId, data, success, error }, { call, put }) {
      const res = yield call(queryRejectNoGood, { orderId, data });
      if (res.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') success(res);
      } else if (typeof error === 'function') { error(res); return; }

      const response = yield call(queryExceptionOrders, {});
      const { headers } = response;            
      yield put({
        type: 'saveException',
        payload: response.data,
        headers,
      });
    },
    *fetchAgreeDelay({ orderId, data, success, error }, { call, put }) {
      const res = yield call(queryAgreeDelay, { orderId, data });
      if (res.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') success(res);
      } else if (typeof error === 'function') { error(res); return; }

      const response = yield call(queryExceptionOrders, {});
      const { headers } = response;            
      yield put({
        type: 'saveException',
        payload: response.data,
        headers,
      });
    },
    *fetchRejectDelay({ orderId, data, success, error }, { call, put }) {
      const res = yield call(queryRejectDelay, { orderId, data });
      if (res.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') success(res);
      } else if (typeof error === 'function') { error(res); return; }

      const response = yield call(queryExceptionOrders, {});
      const { headers } = response;            
      yield put({
        type: 'saveException',
        payload: response.data,
        headers,
      });
    },
    *fetchPayment({ orderId, data, success, error }, { call, put }) {
      const res = yield call(queryPayment, { orderId, data });
      if (res.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') success(res);
      } else if (typeof error === 'function') { error(res); return; }

      const response = yield call(queryOrderDetail, { orderId });      
      yield put({
        type: 'saveDetail',
        payload: response.data,
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
        total: action.headers['x-content-total'] >> 0,
      };
    },
    saveException(state, action) {
      return {
        ...state,
        exceptionList: action.payload,
        total: action.headers['x-content-total'] >> 0,        
      };
    },
    saveDetail(state, action) {
      return {
        ...state,
        detail: action.payload,
      };
    },
    saveSearch(state, action) {
      return {
        ...state,
        list: action.payload,
        exceptionList: action.payload,
      };
    },
  },
};
