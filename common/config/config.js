const config = {
  port: 80,

  proxy: {
    common: 'http:localhost:3000',
  },

  cookie: {
    prefix: 'xxx_',
    domain: '.xxx.com',
  },

  cdn: '',
};

config.api = {};
const path = require('path');

Object.keys(config.proxy || {}).forEach((key) => {
  config.api[key] = path.join(config.root || '/', 'api', key);
});

module.exports = Object.freeze(config);
