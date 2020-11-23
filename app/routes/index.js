const path = require('path');
const Router = require('koa-router');
const OssClient = require('../store/oss');
const router = new Router();
const UserCtl = require('../controllers/userCtl');

router.post('/upload', async (ctx) => {
  const filePath = ctx.request.files.image.path;
  const fileName = path.basename(filePath);
  try {
    const res = await OssClient.put(fileName, ctx.request.files.image.path);
    ctx.body = {
      url: res.url,
    };
  } catch (err) {
    ctx.throw(405, err.message);
  }
});

router.post('/login', UserCtl.login);
router.post('/logout', UserCtl.logout);

module.exports = router;
