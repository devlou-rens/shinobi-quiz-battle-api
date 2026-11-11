const questionSetService = require('../services/question-set.service');

async function listQuestionSets(req, res) {
  const questionSets = await questionSetService.listQuestionSets(
    req.user.user_id
  );

  res.status(200).json({ data: questionSets });
}

async function getQuestionSet(req, res) {
  const questionSet = await questionSetService.getQuestionSet(
    req.params.id,
    req.user.user_id
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
  deleteQuestionSet,
};