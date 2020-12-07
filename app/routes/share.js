const Router = require('koa-router');
const ShareCtl = require('../controllers/shareCtl');
const router = new Router({ prefix: '/share' });
const Auth = require('../middleWare/auth');

router.post('/:code', Auth.mobile, ShareCtl.setShare);
router.get('/:workId', ShareCtl.create);

module.exports = router;
