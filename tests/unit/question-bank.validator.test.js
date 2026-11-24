const {
  validateQuestionBody,
  validateQuestionId,
} = require('../../src/validators/question-bank.validator');

describe('question bank validators', () => {
  const validQuestion = {
    text: 'What is 2 + 2?',
    type: 'multiple-choice',
    timeLimit: 20,
    choices: [
      { choiceText: '3', isCorrect: false },
      { choiceText: '4', isCorrect: true },
    ],
  };

  test('accepts a valid question', () => {
    const next = jest.fn();

    validateQuestionBody({ body: validQuestion }, {}, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  test('rejects empty question text', () => {
    expect(() => validateQuestionBody({
      body: { ...validQuestion, text: ' ' },
    }, {}, jest.fn())).toThrow('Question text is required.');
  });

  test('rejects an unsupported question type', () => {
    expect(() => validateQuestionBody({
      body: { ...validQuestion, type: 'true-false' },
    }, {}, jest.fn())).toThrow(
      'Question type must be multiple-choice.'
    );
  });

  test('rejects an invalid time limit', () => {
    expect(() => validateQuestionBody({
      body: { ...validQuestion, timeLimit: 0 },
    }, {}, jest.fn())).toThrow(
      'Time limit must be a positive integer.'
    );
  });

  test('rejects fewer than two choices', () => {
    expect(() => validateQuestionBody({
      body: { ...validQuestion, choices: [validQuestion.choices[0]] },
    }, {}, jest.fn())).toThrow('At least two choices are required.');
  });

  test('rejects a choice with empty text', () => {
    expect(() => validateQuestionBody({
      body: {
        ...validQuestion,
        choices: [
          { choiceText: '', isCorrect: false },
          { choiceText: '4', isCorrect: true },
        ],
      },
    }, {}, jest.fn())).toThrow(
      'Every choice must have non-empty choiceText.'
    );
  });

  test('rejects when no choice is marked correct', () => {
    expect(() => validateQuestionBody({
      body: {
        ...validQuestion,
        choices: [
          { choiceText: '3', isCorrect: false },
          { choiceText: '4', isCorrect: false },
        ],
      },
    }, {}, jest.fn())).toThrow(
      'Exactly one choice must be marked as correct.'
    );
  });

  test('rejects when more than one choice is marked correct', () => {
    expect(() => validateQuestionBody({
      body: {
        ...validQuestion,
        choices: [
          { choiceText: '3', isCorrect: true },
          { choiceText: '4', isCorrect: true },
        ],
      },
    }, {}, jest.fn())).toThrow(
      'Exactly one choice must be marked as correct.'
    );
  });

  test('accepts a positive question ID', () => {
    const next = jest.fn();

    validateQuestionId({
      params: { questionId: '12' },
    }, {}, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  test.each(['0', '-1', 'abc', '1.5', ''])(
    'rejects invalid question ID: %s',
    (questionId) => {
      expect(() => validateQuestionId({
        params: { questionId },
      }, {}, jest.fn())).toThrow(
        'Question ID must be a positive integer.'
      );
    }
  );
});