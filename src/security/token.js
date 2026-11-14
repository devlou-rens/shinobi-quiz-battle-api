const jwt = require('jsonwebtoken');
const env = require('../config/env');

function issue(user) {
  return jwt.sign(
    {
      sub: String(user.user_id),
      role: user.role,
    },
    env.jwtSecret,
    {
      algorithm: 'HS256',
      expiresIn: env.jwtExpiresIn,
    }
  );
}

function verify(token) {
  return jwt.verify(token, env.jwtSecret, {
    algorithms: ['HS256'],
  });
}

module.exports = { issue, verify };
