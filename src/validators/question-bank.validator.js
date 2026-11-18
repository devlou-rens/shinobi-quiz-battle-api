const { badRequest } = require('../errors/app-error');
const { query } = require('express-validator');
const { pageRules, sortRules } = require('./list.validator');

// Validate pagination, sorting, and search parameters.
const questionBankListRules = [
  ...pageRules,
  ...sortRules(['questionId', 'text', 'type']),
  query('search')
    .optional()
    .isString()
    .withMessage('search must be text.')
    .trim(),
];

// Validate the question body.
function validateQuestionBody(req, res, next) {
  const { text, type, timeLimit, choices } = req.body || {};

  if (typeof text !== 'string' || !text.trim()) {
    throw badRequest(
      'VALIDATION_ERROR',
      'Question text is required.'
    );
  }

  if (type !== 'multiple-choice') {
    throw badRequest(
      'VALIDATION_ERROR',
      'Question type must be multiple-choice.'
    );
  }

  if (!Number.isInteger(timeLimit) || timeLimit <= 0) {
    throw badRequest(
      'VALIDATION_ERROR',
      'Time limit must be a positive integer.'
    );
  }

  if (!Array.isArray(choices) || choices.length < 2) {
    throw badRequest(
      'VALIDATION_ERROR',
      'At least two choices are required.'
    );
  }

  if (
    choices.some(
      (choice) =>
        !choice ||
        typeof choice.choiceText !== 'string' ||
        !choice.choiceText.trim()
    )
  ) {
    throw badRequest(
      'VALIDATION_ERROR',
      'Every choice must have non-empty choiceText.'
    );
  }

  const correctChoices = choices.filter(
    (choice) => choice.isCorrect === true
  );

  if (correctChoices.length !== 1) {
    throw badRequest(
      'VALIDATION_ERROR',
      'Exactly one choice must be marked as correct.'
    );
  }

  next();
}

// Validate the question ID in the URL.
function validateQuestionId(req, res, next) {
  if (!/^[1-9]\d*$/.test(req.params.questionId || '')) {
    throw badRequest(
      'VALIDATION_ERROR',
      'Question ID must be a positive integer.'
    );
  }

  next();
}

module.exports = {
  questionBankListRules,
  validateQuestionBody,
  validateQuestionId,
};