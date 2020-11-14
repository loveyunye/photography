const fs = require('fs');
const index = require('./index');

module.exports = function(app) {
  fs.readdirSync(__dirname).forEach((file) => {
    if (file === 'initRoute.js' || file === 'index.js') {
      return;
    }
    const router = require(`./${file}`);
    if (router && Object.keys(router).length !== 0) {
      app.use(router.routes()).use(router.allowedMethods());
    }
  });
  // 后加载公共Route
  app.use(index.routes()).use(index.allowedMethods());
};
