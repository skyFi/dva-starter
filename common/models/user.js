import {
  fetchTodoList,
  fetchAnotherList
} from '../services/user';
import ModelHelper from './_model_helper';

export default ModelHelper({
  namespace: 'user',
  state: [
    {
      list: undefined,
    }
  ],
  reducers: {
    list(state, { list }) {
      return { ...state, list };
    },
  },
  effects: {
    *fetchTodoList(action, { call, put }) {
      const res = yield call(fetchTodoList);
      if (res) {
        yield put({
          type: 'list',
          list: res
        });
      } else {
        throw new Error(`Init data Error: fetchTodoList.`);
      }
    },
  },
  initData: {
    *fetchAnotherList({}, { call, put }) {
      const res = yield call(fetchAnotherList);
      if (res) {
        yield put({
          type: 'list',
          list: res
        });
      } else {
        throw new Error(`Init data Error: fetchAnotherList.`);
      }
    },
  },
})