const Router = require('koa-router');
const UserCtl = require('../controllers/userCtl');
const router = new Router({ prefix: '/users' });

router.get('/', UserCtl.list);
router.post('/', UserCtl.create);
router.patch('/:id', UserCtl.edit);
router.delete('/:id', UserCtl.delete);

module.exports = router;
