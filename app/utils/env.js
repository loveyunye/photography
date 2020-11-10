const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
const path = require('path');
const fs = require('fs');

// 是否为开发环境
const isDev = ['dev', 'development'].indexOf(process.env.NODE_ENV) > -1 || !process.env.NODE_ENV;

function initEnv() {
  const appPath = fs.realpathSync(process.cwd());
  const pathEnv = path.resolve(appPath, `.env${isDev ? '.dev' : '.prod'}`);
  dotenv.config(); // 获取 .env 默认配置参数
  const env = dotenv.config({
    path: pathEnv,
    debug: process.env.DEBUG,
  });
  dotenvExpand(env);
}

module.exports = {
  isDev,
  initEnv,
};
