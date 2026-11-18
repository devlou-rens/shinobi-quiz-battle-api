const questionSetService = require('../services/question-set.service');
const { matchedData } = require('express-validator');
const { envelope } = require('../utils/paginate');

async function listQuestionSets(req, res) {
  const options = matchedData(req, { locations: ['query'] });

  const page = options.page || 1;
  const limit = options.limit || 10;

  const result = await questionSetService.listQuestionSets(
    req.user.user_id,
    options
  );

  res.status(200).json(
    envelope(result.rows, result.count, { page, limit })
  );
}

async function getQuestionSet(req, res) {
  const includeQuestions = req.query.include === 'questions';

  const questionSet = await questionSetService.getQuestionSet(
    req.params.id,
    req.user.user_id,
    { includeQuestions }
  );

  res.status(200).json({ data: questionSet });
}

async function createQuestionSet(req, res) {
  const questionSet = await questionSetService.createQuestionSet(
    req.body,
    req.user.user_id
  );

  res.status(201).json({ data: questionSet });
}

async function updateQuestionSet(req, res) {
  const questionSet = await questionSetService.updateQuestionSet(
    req.params.id,
    req.body,
    req.user.user_id
  );

  res.status(200).json({ data: questionSet });
}

async function uploadCover(req, res) {
  const coverImage = `/uploads/covers/${req.file.filename}`;

  const questionSet = await questionSetService.uploadQuestionSetCover(
    req.params.id,
    coverImage,
    req.user.user_id
  );

  res.status(200).json({ data: questionSet });
}

async function deleteQuestionSet(req, res) {
  await questionSetService.deleteQuestionSet(
    req.params.id,
    req.user.user_id
  );

  res.status(204).end();
}

module.exports = {
  listQuestionSets,
  getQuestionSet,
  createQuestionSet,
  updateQuestionSet,
  uploadCover,
  deleteQuestionSet,
};