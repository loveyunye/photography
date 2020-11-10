const Router = require('koa-router');
const ImgCtl = require('../controllers/imgCtl');
const router = new Router({ prefix: '/imgs' });

router.get('/', ImgCtl.list);
router.post('/', ImgCtl.create);
router.patch('/:id', ImgCtl.edit);
router.delete('/:id', ImgCtl.delete);

module.exports = router;
