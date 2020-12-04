const path = require('path');
const Router = require('koa-router');
const OssClient = require('../store/oss');
const router = new Router();
const UserCtl = require('../controllers/userCtl');
const axios = require('axios');

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

router.get('/getCode', async (ctx) => {
  const appid = process.env.APPID;
  const APPSECRET = process.env.APPSECRET;
  const { code } = ctx.request.query;
  const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${APPSECRET}&js_code=${code}&grant_type=authorization_code`;
  console.log(url);
  try {
    const { data } = await axios.get(url);
    ctx.body = data;
  } catch (err) {
    ctx.throw(403, 'code无效');
  }
});

router.post('/login', UserCtl.login);
router.post('/logout', UserCtl.logout);

module.exports = router;
