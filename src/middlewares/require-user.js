const { unauthorized, forbidden } = require('../errors/app-error');

function requireUser(...roles) {
  return function guard(req, res, next) {
    if (!req.user) {
      throw unauthorized();
    }

    const userRole = String(req.user.role).toUpperCase();
    const allowedRoles = roles.map((role) => role.toUpperCase());

    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
      throw forbidden(
        `Only these roles may do this: ${allowedRoles.join(', ')}.`
      );
    }

    next();
  };
}

module.exports = requireUser;
