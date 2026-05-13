const { Router } = require('express');
const userController = require('../controllers/user.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { requireAdmin, requireSelfOrAdmin } = require('../middlewares/role.middleware');

const router = Router();

router.use(authenticate);
router.get('/', requireAdmin, userController.getAll);
router.post('/', requireAdmin, userController.create);
router.get('/:id', requireSelfOrAdmin, userController.getById);
router.put('/:id', requireSelfOrAdmin, userController.update);
router.delete('/:id', requireAdmin, userController.remove);

module.exports = router;
