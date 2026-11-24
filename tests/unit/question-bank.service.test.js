
jest.mock('../../src/models', () => ({
  sequelize: {
    transaction: jest.fn(),
  },
}));

jest.mock('../../src/services/question-set.service', () => ({
  getQuestionSet: jest.fn(),
}));

jest.mock('../../src/repositories/question-bank.repository', () => ({
  isQuestionSetUsed: jest.fn(),
  findAllByQuestionSet: jest.fn(),
  createQuestion: jest.fn(),
  createChoices: jest.fn(),
  findById: jest.fn(),
  updateQuestion: jest.fn(),
  deleteChoices: jest.fn(),
  deleteQuestion: jest.fn(),
}));

const { sequelize } = require('../../src/models');
const questionSetService = require('../../src/services/question-set.service');
const repository = require('../../src/repositories/question-bank.repository');

const {
  listQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} = require('../../src/services/question-bank.service');

const questionData = {
  text: 'What is JavaScript?',
  type: 'MULTIPLE_CHOICE',
  timeLimit: 30,
  choices: [
    { choiceText: 'A programming language', isCorrect: true },
    { choiceText: 'A database', isCorrect: false },
  ],
};

describe('question-bank service', () => {
  const transaction = { id: 'test-transaction' };

  beforeEach(() => {
    jest.clearAllMocks();

    questionSetService.getQuestionSet.mockResolvedValue({
      questionSetId: 1,
      hostId: 10,
    });

    repository.isQuestionSetUsed.mockResolvedValue(false);

    sequelize.transaction.mockImplementation(async (callback) => {
      return callback(transaction);
    });
  });

  describe('listQuestions', () => {
    test('lists questions after checking question set ownership', async () => {
      const result = { rows: [], count: 0 };

      repository.findAllByQuestionSet.mockResolvedValue(result);

      const response = await listQuestions(1, 10, { page: 1 });

      expect(questionSetService.getQuestionSet)
        .toHaveBeenCalledWith(1, 10);

      expect(repository.findAllByQuestionSet)
        .toHaveBeenCalledWith(1, { page: 1 });

      expect(response).toBe(result);
    });
  });

  describe('createQuestion', () => {
    test('creates a question and its choices successfully', async () => {
      const createdQuestion = { questionId: 5 };
      const savedQuestion = {
        questionId: 5,
        text: 'What is JavaScript?',
      };

      repository.createQuestion.mockResolvedValue(createdQuestion);
      repository.createChoices.mockResolvedValue([]);
      repository.findById.mockResolvedValue(savedQuestion);

      const result = await createQuestion(1, questionData, 10);

      expect(repository.createQuestion).toHaveBeenCalledWith(
        expect.objectContaining({
          text: 'What is JavaScript?',
          correctIndex: 0,
          questionSetId: 1,
        }),
        { transaction }
      );

      expect(repository.createChoices).toHaveBeenCalledWith(
        [
          { choiceText: 'A programming language', position: 0, questionId: 5 },
          { choiceText: 'A database', position: 1, questionId: 5 },
        ],
        { transaction }
      );

      expect(result).toBe(savedQuestion);
    });

    test('rejects question data without a correct choice', async () => {
      const invalidData = {
        ...questionData,
        choices: questionData.choices.map((choice) => ({
          ...choice,
          isCorrect: false,
        })),
      };

      await expect(
        createQuestion(1, invalidData, 10)
      ).rejects.toMatchObject({
        code: 'VALIDATION_ERROR',
      });

      expect(sequelize.transaction).not.toHaveBeenCalled();
    });

    test('rejects question data with multiple correct choices', async () => {
      const invalidData = {
        ...questionData,
        choices: questionData.choices.map((choice) => ({
          ...choice,
          isCorrect: true,
        })),
      };

      await expect(
        createQuestion(1, invalidData, 10)
      ).rejects.toMatchObject({
        code: 'VALIDATION_ERROR',
      });

      expect(sequelize.transaction).not.toHaveBeenCalled();
    });

    test('rejects creation when the question set is already used', async () => {
      repository.isQuestionSetUsed.mockResolvedValue(true);

      await expect(
        createQuestion(1, questionData, 10)
      ).rejects.toMatchObject({
        code: 'QUESTION_SET_IN_USE',
      });

      expect(repository.createQuestion).not.toHaveBeenCalled();
    });
  });

  describe('updateQuestion', () => {
    test('updates a question and replaces its choices', async () => {
      const question = {
        questionId: 5,
        questionSetId: 1,
      };

      repository.findById
        .mockResolvedValueOnce(question)
        .mockResolvedValueOnce(question);

      const result = await updateQuestion(1, 5, questionData, 10);

      expect(repository.updateQuestion).toHaveBeenCalledWith(
        question,
        expect.objectContaining({
          text: 'What is JavaScript?',
          correctIndex: 0,
        }),
        { transaction }
      );

      expect(repository.deleteChoices)
        .toHaveBeenCalledWith(5, { transaction });

      expect(repository.createChoices).toHaveBeenCalled();

      expect(result).toBe(question);
    });

    test('rejects updating a question that does not exist', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(
        updateQuestion(1, 99, questionData, 10)
      ).rejects.toMatchObject({
        code: 'QUESTION_NOT_FOUND',
      });
    });

    test('rejects updating a question from another question set', async () => {
      repository.findById.mockResolvedValue({
        questionId: 5,
        questionSetId: 2,
      });

      await expect(
        updateQuestion(1, 5, questionData, 10)
      ).rejects.toMatchObject({
        code: 'QUESTION_NOT_FOUND',
      });
    });
  });

  describe('deleteQuestion', () => {
    test('deletes a question and its choices', async () => {
      const question = {
        questionId: 5,
        questionSetId: 1,
      };

      repository.findById.mockResolvedValue(question);

      await deleteQuestion(1, 5, 10);

      expect(repository.deleteChoices)
        .toHaveBeenCalledWith(5, { transaction });

      expect(repository.deleteQuestion)
        .toHaveBeenCalledWith(question, { transaction });
    });

    test('rejects deleting a question that does not exist', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(
        deleteQuestion(1, 99, 10)
      ).rejects.toMatchObject({
        code: 'QUESTION_NOT_FOUND',
      });

      expect(repository.deleteChoices).not.toHaveBeenCalled();
      expect(repository.deleteQuestion).not.toHaveBeenCalled();
    });

    test('rejects deleting a question from another question set', async () => {
      repository.findById.mockResolvedValue({
        questionId: 5,
        questionSetId: 2,
      });

      await expect(
        deleteQuestion(1, 5, 10)
      ).rejects.toMatchObject({
        code: 'QUESTION_NOT_FOUND',
      });

      expect(repository.deleteChoices).not.toHaveBeenCalled();
      expect(repository.deleteQuestion).not.toHaveBeenCalled();
    });
  });
});
