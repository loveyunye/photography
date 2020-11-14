const Redis = require('ioredis');

/**
 * redis 对象
 */
const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: +process.env.REDIS_PORT,
  password: process.env.REDIS_DB_PASSWORD,
});

/**
 * redis 订阅对象
 */
const subRedis = new Redis({
  host: process.env.REDIS_HOST,
  port: +process.env.REDIS_PORT,
  password: process.env.REDIS_DB_PASSWORD,
});

module.exports = {
  redis,
  subRedis,
};
