
const userRepository = require('../repositories/user.repository');
const { conflict, notFound } = require('../errors/app-error');

function safeUser(user) {
  return {
    user_id: user.user_id,
    school_id: user.school_id,
    full_name: user.full_name,
    email: user.email,
    role: String(user.role).toUpperCase(),
  };
}

async function listUsers() {
  const users = await userRepository.findAll();
  return users.map(safeUser);
}

async function changeRole(targetUserId, newRole, adminUserId) {
  // An administrator cannot change their own role.
  if (Number(targetUserId) === Number(adminUserId)) {
    throw conflict(
      'CANNOT_CHANGE_OWN_ROLE',
      'You cannot change your own role.'
    );
  }

  const user = await userRepository.findById(targetUserId);

  if (!user) {
    throw notFound('USER_NOT_FOUND', 'User account not found.');
  }

  await userRepository.update(user, {
    role: newRole,
  });

  return safeUser(user);
}

module.exports = {
  listUsers,
  changeRole,
};
