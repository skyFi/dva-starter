'use strict';

const cache = require('./cache');
const co = require('co');
const randomstring = require('randomstring');
const EXPIRE = 10;

module.exports = function(req, res) {
  co(function *() {
    const key = req.params.key;
    if (!key) {
      return '';
    }
    const value = yield cache.getAsync(`${cache.prefix}:state:${key}`);
    return value || '';
  }).then(value => {
    res.type('text/javascript');
    res.send(`window.states = ${JSON.stringify(value)};`);
  }, err => {
    res.type('text/javascript');
    res.send(`window.states = "{}"; console.error(${JSON.stringify(err.message || err)})`);
  });
};

module.exports.set = function *(stateString) {
  const key = randomstring.generate() + Date.now();
  yield cache.setexAsync(`${cache.prefix}:state:${key}`, EXPIRE, stateString);
  return key;
};