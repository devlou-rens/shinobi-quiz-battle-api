
const { User } = require('../models');

function findBySchoolId(schoolId) {
  return User.findOne({
    where: { school_id: schoolId },
  });
}

// Login is the only operation that retrieves the password hash.
function findForLogin(schoolId) {
  return User.scope('withPassword').findOne({
    where: { school_id: schoolId },
  });
}

function findById(userId) {
  return User.findByPk(userId);
}

function findAll() {
  return User.findAll({
    order: [['user_id', 'ASC']],
  });
}

function create(data) {
  return User.create(data);
}

function update(user, changes) {
  return user.update(changes);
}

function findByEmail(email) {
  return User.findOne({
    where: { email },
  });
}

module.exports = {
  findBySchoolId,
  findByEmail,
  findForLogin,
  findById,
  findAll,
  create,
  update,
};
