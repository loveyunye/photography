const fs = require('fs');
// const indexRoute = require('./indexRoute');
module.exports = function(app) {
  fs.readdirSync(__dirname).forEach((file) => {
    if (file === 'index.js' || file === 'indexRoute.js') {
      return;
    }
    const router = require(`./${file}`);
    app.use(router.routes()).use(router.allowedMethods());
  });
  // 后加载公共Route
  // app.use(indexRoute.routes()).use(indexRoute.allowedMethods());
};
