const { Router } = require('express');
const questionSetController = require('../controllers/question-set.controller');
const questionBankController = require('../controllers/question-bank.controller');
const requireUser = require('../middlewares/require-user');
const validate = require('../middlewares/validate');
const uploadCover = require('../middlewares/upload-cover');

const {
  questionSetListRules,
  validateQuestionSetBody,
  validateCreateQuestionSet,
  validateQuestionSetId,
} = require('../validators/question-set.validator');

const {
  questionBankListRules,
  validateQuestionBody,
  validateQuestionId,
} = require('../validators/question-bank.validator');

const router = Router();

// Only hosts can manage question sets and their questions.
router.use(requireUser('host'));

// List question sets.
router.get(
  '/:id/questions',
  validateQuestionSetId,
  questionBankListRules,
  validate,
  questionBankController.listQuestions
);

// Create a question set.
router.post(
  '/',
  validateCreateQuestionSet,
  questionSetController.createQuestionSet
);

// List questions in a question set.
router.get(
  '/:id/questions',
  validateQuestionSetId,
  validate,
  questionBankController.listQuestions
);

// Create a question in a question set.
router.post(
  '/:id/questions',
  validateQuestionSetId,
  validateQuestionBody,
  questionBankController.createQuestion
);

// Update a question in a question set.
router.patch(
  '/:id/questions/:questionId',
  validateQuestionSetId,
  validateQuestionId,
  validateQuestionBody,
  questionBankController.updateQuestion
);

// Delete a question in a question set.
router.delete(
  '/:id/questions/:questionId',
  validateQuestionSetId,
  validateQuestionId,
  questionBankController.deleteQuestion
);

// Upload a cover image for a question set.
router.put(
  '/:id/cover',
  validateQuestionSetId,
  validate,
  uploadCover,
  questionSetController.uploadCover
);

// Get one question set.
router.get(
  '/:id',
  validateQuestionSetId,
  validate,
  questionSetController.getQuestionSet
);

// Update a question set.
router.patch(
  '/:id',
  validateQuestionSetId,
  validateQuestionSetBody,
  questionSetController.updateQuestionSet
);

// Delete a question set.
router.delete(
  '/:id',
  validateQuestionSetId,
  questionSetController.deleteQuestionSet
);

module.exports = router;
