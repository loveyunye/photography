const Router = require('koa-router');
const WorkCtl = require('../controllers/workCtl');
const router = new Router({ prefix: '/work' });

router.get('/', WorkCtl.list);
router.post('/', WorkCtl.create);
router.patch('/:id', WorkCtl.edit);
router.delete('/:id', WorkCtl.delete);

module.exports = router;
