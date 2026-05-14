const { Router } = require('express');
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/auth.middleware');

const router = Router();

router.post('/login', authController.login);
router.post('/register', authController.registerUser);
router.post('/recover/check-email', authController.recoverCheckEmail);
router.post('/recover/set-password', authController.recoverSetPassword);
router.get('/me', authenticate, authController.me);

module.exports = router;
