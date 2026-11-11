const { badRequest } = require('../errors/app-error');

function validateQuestionSetBody(req, res, next) {
  const { title, subject } = req.body || {};

  if (title !== undefined &&
      (typeof title !== 'string' || !title.trim())) {
    throw badRequest(
      'VALIDATION_ERROR',
      'title must be a non-empty string.'
    );
  }

  if (subject !== undefined &&
      (typeof subject !== 'string' || !subject.trim())) {
    throw badRequest(
      'VALIDATION_ERROR',
      'subject must be a non-empty string.'
    );
  }

  next();
}

function validateCreateQuestionSet(req, res, next) {
  const { title, subject } = req.body || {};

  if (typeof title !== 'string' || !title.trim()) {
    throw badRequest(
      'VALIDATION_ERROR',
      'title is required and must be a non-empty string.'
    );
  }

  if (typeof subject !== 'string' || !subject.trim()) {
    throw badRequest(
      'VALIDATION_ERROR',
      'subject is required and must be a non-empty string.'
    );
  }

  next();
}

function validateQuestionSetId(req, res, next) {
  const id = req.params.id;

  if (!/^[1-9]\d*$/.test(id)) {
    throw badRequest(
      'VALIDATION_ERROR',
      'Question set ID must be a positive integer.'
    );
  }

  next();
}

module.exports = {
  validateQuestionSetBody,
  validateCreateQuestionSet,
  validateQuestionSetId,
};