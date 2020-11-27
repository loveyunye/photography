const Router = require('koa-router');
const WorkCtl = require('../controllers/workCtl');
const router = new Router({ prefix: '/works' });
const Auth = require('../middleWare/auth');

router.get('/', Auth.admin, WorkCtl.list);
router.get('/all', Auth.admin, WorkCtl.all);
router.post('/', Auth.admin, WorkCtl.create);
router.patch('/:id', Auth.admin, WorkCtl.edit);
router.delete('/:id', Auth.admin, WorkCtl.delete);

module.exports = router;
