
const { matchedData } = require('express-validator');
const authService = require('../services/auth.service');
const userRepository = require('../repositories/user.repository');

async function register(req, res, next) {
  try {
    // Only use fields that passed validation.
    // This prevents a submitted "role": "ADMIN" from being accepted.
    const data = matchedData(req, { locations: ['body'] });

    const user = await authService.register(data);

    return res.status(201).json({ user });
  } catch (error) {
    return next(error);
  }
}

async function login(req, res, next) {
  try {
    const { school_id, password } = matchedData(req, {
      locations: ['body'],
    });

    const result = await authService.login(school_id, password);

    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

async function me(req, res, next) {
  try {
    const account = await userRepository.findById(req.user.user_id);

    if (!account) {
      return res.status(404).json({
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User account not found.',
        },
      });
    }

    return res.status(200).json({
      user: {
        user_id: account.user_id,
        school_id: account.school_id,
        full_name: account.full_name,
        email: account.email,
        role: String(account.role).toUpperCase(),
      },
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  register,
  login,
  me,
};
