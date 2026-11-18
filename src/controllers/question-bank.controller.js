const questionBankService = require('../services/question-bank.service');
const { envelope } = require('../utils/paginate');
// List questions belonging to a question set.
async function listQuestions(req, res) {
  const options = {
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 10,
    sort: req.query.sort || 'questionId',
    order: req.query.order || 'asc',
    search: req.query.search,
  };

  const result = await questionBankService.listQuestions(
    req.params.id,
    req.user.user_id,
    options
  );

  res.status(200).json(
    envelope(result.rows, result.count, options)
  );
}

// Create a question with its choices.
async function createQuestion(req, res) {
  const question = await questionBankService.createQuestion(
    req.params.id,
    req.body,
    req.user.user_id
  );

  res.status(201).json({ data: question });
}

// Update a question and its choices.
async function updateQuestion(req, res) {
  const question = await questionBankService.updateQuestion(
    req.params.id,
    req.params.questionId,
    req.body,
    req.user.user_id
  );

  res.status(200).json({ data: question });
}

// Delete a question.
async function deleteQuestion(req, res) {
  await questionBankService.deleteQuestion(
    req.params.id,
    req.params.questionId,
    req.user.user_id
  );

  res.status(204).end();
}

module.exports = {
  listQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
};
