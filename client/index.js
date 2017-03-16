import { browserHistory } from 'dva/router';
import createApp from '../common/create_app';
import router from '../common/routes';
import * as models from '../common/models';
import './app.less';

const app = createApp({
  history: browserHistory,
  initialState: JSON.parse(window.states),
}, { router, models });
delete window.states;
app.start('#root');