const Router = require('koa-router');
const ImgCtl = require('../controllers/imgCtl');
const router = new Router({ prefix: '/imgs' });
const Auth = require('../middleWare/auth');

router.get('/', Auth.admin, ImgCtl.list);
router.post('/', Auth.admin, ImgCtl.create);
router.patch('/:id', Auth.admin, ImgCtl.edit);
router.delete('/:id', Auth.admin, ImgCtl.delete);

module.exports = router;
