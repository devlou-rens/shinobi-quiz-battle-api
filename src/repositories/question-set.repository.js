const { QuestionSet } = require('../models');

async function findAllByHost(hostId) {
  return QuestionSet.findAll({
    where: { hostId },
    order: [['questionSetId', 'ASC']],
  });
}

async function findById(questionSetId) {
  return QuestionSet.findByPk(questionSetId);
}

async function create(data) {
  return QuestionSet.create(data);
}

async function update(questionSet, changes) {
  return questionSet.update(changes);
}

async function remove(questionSet) {
  return questionSet.destroy();
}

module.exports = {
  findAllByHost,
  findById,
  create,
  update,
  remove,
};
