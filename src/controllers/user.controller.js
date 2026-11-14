const { matchedData } = require('express-validator');
const userService = require('../services/user.service');

async function listUsers(req, res, next) {
  try {
    const users = await userService.listUsers();

    return res.status(200).json({ users });
  } catch (error) {
    return next(error);
  }
}

async function changeRole(req, res, next) {
  try {
    const { role } = matchedData(req, {
      locations: ['body'],
    });

    const user = await userService.changeRole(
      Number(req.params.id),
      role,
      req.user.user_id
    );

    return res.status(200).json({ user });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listUsers,
  changeRole,
};
