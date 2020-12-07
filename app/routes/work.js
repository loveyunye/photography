const Router = require('koa-router');
const WorkCtl = require('../controllers/workCtl');
const router = new Router({ prefix: '/works' });
const Auth = require('../middleWare/auth');
// router.use(Auth.admin);

router.get('/', Auth.admin, WorkCtl.list);
router.get('/all', Auth.admin, WorkCtl.all);
router.post('/', Auth.admin, WorkCtl.create);
router.patch('/:id', Auth.admin, WorkCtl.edit);
router.delete('/:id', Auth.admin, WorkCtl.delete);
router.post('/link/:id', Auth.admin, WorkCtl.setLink);
router.post('/setImgs/:id', Auth.admin, WorkCtl.setImgs);

router.get('/detail/:id', WorkCtl.getDetail);
router.get('/code/:code', WorkCtl.getDetailByCode);

router.get('/mobile', Auth.mobile, WorkCtl.list);
router.get('/mobile/normal', Auth.mobile, WorkCtl.getWorks);
router.get('/mobile/self/:id', Auth.mobile, WorkCtl.self);
router.post('/mobile/selectImgs/:id', Auth.mobile, WorkCtl.selectImgs);

module.exports = router;
