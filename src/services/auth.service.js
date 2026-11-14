
const userRepository = require('../repositories/user.repository');
const password = require('../security/password');
const token = require('../security/token');
const env = require('../config/env');
const { conflict, unauthorized } = require('../errors/app-error');

function safeUser(user) {
  return {
    user_id: user.user_id,
    school_id: user.school_id,
    full_name: user.full_name,
    email: user.email,
    role: String(user.role).toUpperCase(),
  };
}

async function register(data) {
  // Check whether the school ID or email is already registered.
  const existingSchoolId = await userRepository.findBySchoolId(data.school_id);

  if (existingSchoolId) {
    throw conflict('SCHOOL_ID_EXISTS', 'This school ID is already registered.');
  }

  const existingEmail = await userRepository.findByEmail(data.email);

  if (existingEmail) {
    throw conflict('EMAIL_EXISTS', 'This email address is already registered.');
  }

  // Hash the password before saving it.
  const passwordHash = await password.hash(data.password);

  // Public registration always creates a PLAYER account.
  const user = await userRepository.create({
    school_id: data.school_id,
    full_name: data.full_name,
    email: data.email,
    password_hash: passwordHash,
    role: 'PLAYER',
  });

  return safeUser(user);
}

async function login(schoolId, plainPassword) {
  const user = await userRepository.findForLogin(schoolId);

  // Always compare a password, even when the account does not exist.
  const passwordIsValid = await password.matches(
    plainPassword,
    user ? user.password_hash : null
  );

  if (!user || !passwordIsValid) {
    throw unauthorized(
      'School ID or password is incorrect.',
      'INVALID_CREDENTIALS'
    );
  }

  const publicUser = safeUser(user);

  return {
    token: token.issue(publicUser),
    token_type: 'Bearer',
    expires_in: env.jwtExpiresIn,
    user: publicUser,
  };
}

module.exports = {
  register,
  login,
};
