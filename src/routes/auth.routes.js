
const { Router } = require('express');
const authController = require('../controllers/auth.controller');
const validate = require('../middlewares/validate');
const requireUser = require('../middlewares/require-user');
const {
  registerRules,
  loginRules,
} = require('../validators/auth.validator');

const router = Router();

// Register a new PLAYER account.
router.post('/register', registerRules, validate, authController.register);

// Log in and receive a JWT.
router.post('/login', loginRules, validate, authController.login);

// Get the currently authenticated account.
router.get('/me', requireUser(), authController.me);

module.exports = router;
