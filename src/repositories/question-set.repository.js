const { Op } = require('sequelize');
const { QuestionSet, Question, QuestionChoice } = require('../models');
const { toOffset } = require('../utils/paginate');

async function findAllByHost(
  hostId,
  {
    page = 1,
    limit = 10,
    sort = 'questionSetId',
    order = 'asc',
    search,
  } = {}
) {
  const where = { hostId };

  // Search question set titles and subjects.
  // An empty search returns all question sets.
  if (search) {
    where[Op.or] = [
      {
        title: {
          [Op.iLike]: `%${search}%`,
        },
      },
      {
        subject: {
          [Op.iLike]: `%${search}%`,
        },
      },
    ];
  }

  return QuestionSet.findAndCountAll({
    where,
    ...toOffset({ page, limit }),
    order: [[sort, order.toUpperCase()]],
  });
}

async function findById(questionSetId, { includeQuestions = false } = {}) {
  const options = {};

  if (includeQuestions) {
    options.include = [
      {
        model: Question,
        as: 'questions',
        include: [
          {
            model: QuestionChoice,
            as: 'choices',
          },
        ],
      },
    ];
  }

  return QuestionSet.findByPk(questionSetId, options);
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