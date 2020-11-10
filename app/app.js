const Koa = require('koa');
const initApp = require('./core/init');
const app = new Koa();
initApp.initApp(app);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
