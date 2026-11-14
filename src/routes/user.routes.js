
const { Router } = require('express');
const { param } = require('express-validator');

const userController = require('../controllers/user.controller');
const requireUser = require('../middlewares/require-user');
const validate = require('../middlewares/validate');
const { roleRules } = require('../validators/auth.validator');

const router = Router();

// Every route in this file requires an administrator.
router.use(requireUser('ADMIN'));

// List all accounts.
router.get('/', userController.listUsers);

// Change another user's role.
router.patch(
  '/:id/role',
  [
    param('id')
      .isInt({ min: 1 })
      .withMessage('User ID must be a positive integer.'),
  ],
  roleRules,
  validate,
  userController.changeRole
);

module.exports = router;
