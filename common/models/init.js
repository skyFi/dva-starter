import { setRedirectToDispatch, getDispatch } from '../utils/funcs';

export default {
  namespace: '_init',
  state: {},
  subscriptions: {
    init({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        // set redirect.
        if (!getDispatch()) { setRedirectToDispatch(dispatch); }

        //todo: do something for init.
      });
    },
  },
};
