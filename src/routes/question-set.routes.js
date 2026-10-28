const { Router } = require('express');
const questionSetController = require('../controllers/question-set.controller');
const requireUser = require('../middlewares/require-user');

const {
  validateQuestionSetBody,
  validateCreateQuestionSet,
  validateQuestionSetId,
} = require('../validators/question-set.validator');

const router = Router();

// Only hosts can manage question sets.
router.use(requireUser('host'));

// List question sets.
router.get('/', questionSetController.listQuestionSets);

// Create a question set.
router.post(
  '/',
  validateCreateQuestionSet,
  questionSetController.createQuestionSet
);

// Get one question set.
router.get(
  '/:id',
  validateQuestionSetId,
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