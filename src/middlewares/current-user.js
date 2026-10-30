const env = require('../config/env');
const userRepository = require('../repositories/user.repository');

// Week 11 temporary demo authentication.
// The caller identifies their account using the X-Demo-User header.
// Week 12 will replace this with real token authentication.

if (env.nodeEnv === 'production') {
  throw new Error(
    'current-user.js is the Week 11 stand-in. Replace it before production.'
  );
}

async function currentUser(req, res, next) {
  try {
    const schoolId = req.get('X-Demo-User');

    const user = schoolId
      ? await userRepository.findBySchoolId(schoolId)
      : null;

    // Pass only the account information required by the API.
    req.user = user
      ? {
          user_id: user.user_id,
          school_id: user.school_id,
          role: user.role,
        }
      : null;

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = currentUser;