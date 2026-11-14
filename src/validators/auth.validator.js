
const { body } = require('express-validator');

// Registration validation
const registerRules = [
  body('school_id')
    .isString().withMessage('School ID must be text.')
    .bail()
    .trim()
    .matches(/^\d{8}$/).withMessage('School ID must contain exactly 8 digits.'),

  body('full_name')
    .isString().withMessage('Full name must be text.')
    .bail()
    .trim()
    .notEmpty().withMessage('Full name is required.')
    .isLength({ max: 100 }).withMessage('Full name must not exceed 100 characters.'),

  body('email')
    .isString().withMessage('Email must be text.')
    .bail()
    .trim()
    .isEmail().withMessage('Enter a valid email address.')
    .normalizeEmail(),

  body('password')
    .isString().withMessage('Password must be text.')
    .bail()
    .isLength({ min: 8, max: 72 })
    .withMessage('Password must be 8 to 72 characters.')
    .matches(/[A-Za-z]/).withMessage('Password must contain a letter.')
    .matches(/\d/).withMessage('Password must contain a number.'),
];

// Login validation
const loginRules = [
  body('school_id')
    .exists().withMessage('School ID is required.')
    .bail()
    .isString().withMessage('School ID must be text.')
    .bail()
    .trim()
    .notEmpty().withMessage('School ID is required.'),

  body('password')
    .exists().withMessage('Password is required.')
    .bail()
    .isString().withMessage('Password must be text.')
    .bail()
    .notEmpty().withMessage('Password is required.'),
];

// Role validation for authorized role-management routes.
// Do not include this in registration rules.
const roleRules = [
  body('role')
    .isIn(['PLAYER', 'HOST', 'ADMIN'])
    .withMessage('Role must be PLAYER, HOST, or ADMIN.'),
];

module.exports = {
  registerRules,
  loginRules,
  roleRules,
};
