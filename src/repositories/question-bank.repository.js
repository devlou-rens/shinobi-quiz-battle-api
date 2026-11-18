const { Question, QuestionChoice, GameSession,} = require('../models');
const { Op } = require('sequelize');
const { toOffset } = require('../utils/paginate');

async function findAllByQuestionSet(
  questionSetId,
  {
    page = 1,
    limit = 10,
    sort = 'questionId',
    order = 'asc',
    search,
  } = {}
) {
  const where = { questionSetId };

  // Search question text.
  if (search) {
    where.text = {
      [Op.iLike]: `%${search}%`,
    };
  }

  return Question.findAndCountAll({
    where,
    include: [
      {
        model: QuestionChoice,
        as: 'choices',
      },
    ],
    distinct: true,
    ...toOffset({ page, limit }),
    order: [[sort, order.toUpperCase()]],
  });
}

async function findById(questionId, options = {}) {
  return Question.findByPk(questionId, {
    include: [
      {
        model: QuestionChoice,
        as: 'choices',
      },
    ],
    ...options,
  });
}

async function createQuestion(data, options = {}) {
  return Question.create(data, options);
}

async function createChoices(choices, options = {}) {
  return QuestionChoice.bulkCreate(choices, options);
}

async function updateQuestion(question, changes, options = {}) {
  return question.update(changes, options);
}

async function deleteChoices(questionId, options = {}) {
  return QuestionChoice.destroy({
    where: { questionId },
    ...options,
  });
}

async function deleteQuestion(question, options = {}) {
  return question.destroy(options);
}

async function isQuestionSetUsed(questionSetId, options = {}) {
  const session = await GameSession.findOne({
    where: { questionSetId },
    ...options,
  });

  return Boolean(session);
}

module.exports = {
  findAllByQuestionSet,
  findById,
  createQuestion,
  createChoices,
  updateQuestion,
  deleteChoices,
  deleteQuestion,
  isQuestionSetUsed,
};