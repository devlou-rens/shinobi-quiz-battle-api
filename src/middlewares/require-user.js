const { unauthorized, forbidden } = require('../errors/app-error');

function requireUser(...roles) {
  return function guard(req, res, next) {
    if (!req.user) {
      throw unauthorized();
    }

    const userRole = req.user.role.toLowerCase();
    const allowedRoles = roles.map((role) => role.toLowerCase());

    if (roles.length > 0 && !allowedRoles.includes(userRole)) {
      throw forbidden(`Only these roles may do this: ${roles.join(', ')}.`);
    }

    next();
  };
}

module.exports = requireUser;