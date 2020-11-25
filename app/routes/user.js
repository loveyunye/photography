const Router = require('koa-router');
const UserCtl = require('../controllers/userCtl');
const router = new Router({ prefix: '/users' });
const Auth = require('../middleWare/auth');

router.get('/', Auth.admin, UserCtl.list);
router.post('/', UserCtl.create);
router.patch('/:id', Auth.admin, UserCtl.edit);
router.delete('/:id', Auth.admin, UserCtl.delete);

module.exports = router;
