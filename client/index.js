import { browserHistory } from 'dva/router';
import createApp from '../common/create_app';
import router from '../common/routes';
import * as models from '../common/models';
import './app.less';

const app = createApp({
  history: browserHistory,
  initialState: window.__INITIAL_STATE__,
}, { router, models });
app.start('#root');