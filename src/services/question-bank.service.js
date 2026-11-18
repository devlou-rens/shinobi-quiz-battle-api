const { sequelize } = require('../models');
const questionSetService = require('./question-set.service');
const questionBankRepository = require('../repositories/question-bank.repository');
const { badRequest, conflict } = require('../errors/app-error');

// Check whether the question set is already used by a game.
async function ensureQuestionSetIsEditable(questionSetId, transaction) {
  const isUsed = await questionBankRepository.isQuestionSetUsed(
    questionSetId,
    { transaction }
  );

  if (isUsed) {
    throw conflict(
      'QUESTION_SET_IN_USE',
      'This question set cannot be changed because it is already used by a game.'
    );
  }
}

// Prepare choices and identify the correct answer.
function prepareQuestionData(data) {
  const correctIndex = data.choices.findIndex(
    (choice) => choice.isCorrect === true
  );

  if (correctIndex === -1 ||
      data.choices.filter((choice) => choice.isCorrect === true).length !== 1) {
    throw badRequest(
      'VALIDATION_ERROR',
      'Exactly one choice must be marked as correct.'
    );
  }

  return {
    question: {
      text: data.text.trim(),
      type: data.type,
      correctIndex,
      timeLimit: data.timeLimit,
    },
    choices: data.choices.map((choice, index) => ({
      choiceText: choice.choiceText.trim(),
      position: index,
    })),
  };
}

// List questions and their choices in a question set.
async function listQuestions(questionSetId, hostId, options = {}) {
  await questionSetService.getQuestionSet(questionSetId, hostId);

  return questionBankRepository.findAllByQuestionSet(
    questionSetId,
    options
  );
}

// Create a question and its choices in one transaction.
async function createQuestion(questionSetId, data, hostId) {
  await questionSetService.getQuestionSet(questionSetId, hostId);

  const prepared = prepareQuestionData(data);

  return sequelize.transaction(async (t) => {
    await ensureQuestionSetIsEditable(questionSetId, t);

    const question = await questionBankRepository.createQuestion(
      {
        ...prepared.question,
        questionSetId,
      },
      { transaction: t }
    );

    await questionBankRepository.createChoices(
      prepared.choices.map((choice) => ({
        ...choice,
        questionId: question.questionId,
      })),
      { transaction: t }
    );

    return questionBankRepository.findById(
      question.questionId,
      { transaction: t }
    );
  });
}

// Update a question and replace its choices.
async function updateQuestion(questionSetId, questionId, data, hostId) {
  await questionSetService.getQuestionSet(questionSetId, hostId);

  const prepared = prepareQuestionData(data);

  return sequelize.transaction(async (t) => {
    await ensureQuestionSetIsEditable(questionSetId, t);

    const question = await questionBankRepository.findById(
      questionId,
      { transaction: t }
    );

    if (!question || Number(question.questionSetId) !== Number(questionSetId)) {
      throw badRequest(
        'QUESTION_NOT_FOUND',
        'Question not found in this question set.'
      );
    }

    await questionBankRepository.updateQuestion(
      question,
      prepared.question,
      { transaction: t }
    );

    await questionBankRepository.deleteChoices(
      questionId,
      { transaction: t }
    );

    await questionBankRepository.createChoices(
      prepared.choices.map((choice) => ({
        ...choice,
        questionId,
      })),
      { transaction: t }
    );

    return questionBankRepository.findById(
      questionId,
      { transaction: t }
    );
  });
}

// Delete a question and its choices.
async function deleteQuestion(questionSetId, questionId, hostId) {
  await questionSetService.getQuestionSet(questionSetId, hostId);

  return sequelize.transaction(async (t) => {
    await ensureQuestionSetIsEditable(questionSetId, t);

    const question = await questionBankRepository.findById(
      questionId,
      { transaction: t }
    );

    if (!question || Number(question.questionSetId) !== Number(questionSetId)) {
      throw badRequest(
        'QUESTION_NOT_FOUND',
        'Question not found in this question set.'
      );
    }

    await questionBankRepository.deleteChoices(
      questionId,
      { transaction: t }
    );

    await questionBankRepository.deleteQuestion(
      question,
      { transaction: t }
    );
  });
}

module.exports = {
  listQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
};
