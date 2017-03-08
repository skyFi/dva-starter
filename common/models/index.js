// system server model, just for reducer key.
export const _system = {
  namespace: '_system',
  state: {
    serverGetDataError: undefined,
  },
  reducers: {},
};

// init models.
export const init = require('./init');

// custom route models.
export const about = require('./about');
export const user = require('./user');