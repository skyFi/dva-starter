'use strict';

const config = require('./config');
const redis = require('redis');
const bluebird = require('bluebird');
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const cache = redis.createClient(config.cache.port, config.cache.host);

cache.prefix = config.cache.prefix || 'unset';

module.exports = cache;