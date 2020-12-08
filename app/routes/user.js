const Router = require('koa-router');
const UserCtl = require('../controllers/userCtl');
const router = new Router({ prefix: '/users' });
const Auth = require('../middleWare/auth');

router.get('/', Auth.admin, UserCtl.list);
router.get('/all', Auth.admin, UserCtl.all);

router.post('/', Auth.admin, UserCtl.create);
router.patch('/:id', Auth.admin, UserCtl.edit);

router.delete('/:id', Auth.admin, UserCtl.delete);
router.get('/detail/:id', Auth.admin, UserCtl.getWorks);
router.post('/updatePass', Auth.admin, UserCtl.updatePass);

router.get('/mobile', Auth.mobile, UserCtl.getMy);
router.post('/mobile', UserCtl.mobile);

module.exports = router;
