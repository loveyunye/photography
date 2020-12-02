const Router = require('koa-router');
const WorkCtl = require('../controllers/workCtl');
const router = new Router({ prefix: '/works' });
// const Auth = require('../middleWare/auth');
// router.use(Auth.admin);

router.get('/', WorkCtl.list);
router.get('/all', WorkCtl.all);
router.post('/', WorkCtl.create);
router.patch('/:id', WorkCtl.edit);
router.delete('/:id', WorkCtl.delete);
router.get('/detail/:id', WorkCtl.getDetail);
router.post('/link/:id', WorkCtl.setLink);
router.post('/setImgs/:id', WorkCtl.setImgs);

module.exports = router;
