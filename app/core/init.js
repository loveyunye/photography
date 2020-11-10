const Router = require('koa-router');
const Error = require('koa-json-error');
const Parameter = require('koa-parameter');
const Body = require('koa-body');
const routing = require('../routes/initRoute');
const { isDev } = require('../utils/env');

class InitManager {
  static initApp(app) {
    InitManager.app = app;
    InitManager.registerMiddleWare();
    InitManager.loadModel();
    InitManager.loadRouters();
  }

  // 加载中间键
  static registerMiddleWare() {
    const { app } = InitManager;
    // 错误处理
    app.use(
      Error({
        postFormat: (e, { stack, ...rest }) => (isDev ? { stack, ...rest } : rest),
      }),
    );

    // 解析请求体
    app.use(
      Body({
        multipart: true,
        formidable: {
          keepExtensions: true,
          maxFileSize: 200 * 1024 * 1024,
        },
      }),
    );
    // 参数校验
    app.use(Parameter(app));
  }

  // 加载模块
  static loadModel() {
    require('../models/initDB');
  }

  // 加载路由
  static loadRouters() {
    const apiRouter = new Router({ prefix: '/api' });
    const { app } = InitManager;
    routing(apiRouter);
    app.use(apiRouter.routes());
  }
}

module.exports = InitManager;
