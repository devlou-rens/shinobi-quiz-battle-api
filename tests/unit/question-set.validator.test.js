const {
  validateQuestionSetBody,
  validateCreateQuestionSet,
  validateQuestionSetId,
} = require('../../src/validators/question-set.validator');

describe('question set validators', () => {
  test('accepts an empty optional update body', () => {
    const next = jest.fn();

    validateQuestionSetBody({ body: {} }, {}, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  test('accepts valid title and subject updates', () => {
    const next = jest.fn();

    validateQuestionSetBody({
      body: { title: 'Science', subject: 'General Science' },
    }, {}, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  test('rejects an empty title update', () => {
    expect(() => validateQuestionSetBody({
      body: { title: ' ' },
    }, {}, jest.fn())).toThrow(
      'title must be a non-empty string.'
    );
  });

  test('rejects an empty subject update', () => {
    expect(() => validateQuestionSetBody({
      body: { subject: ' ' },
    }, {}, jest.fn())).toThrow(
      'subject must be a non-empty string.'
    );
  });

  test('accepts a valid question set creation', () => {
    const next = jest.fn();

    validateCreateQuestionSet({
      body: { title: 'Science', subject: 'General Science' },
    }, {}, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  test('rejects a missing title during creation', () => {
    expect(() => validateCreateQuestionSet({
      body: { subject: 'General Science' },
    }, {}, jest.fn())).toThrow(
      'title is required and must be a non-empty string.'
    );
  });

  test('rejects a missing subject during creation', () => {
    expect(() => validateCreateQuestionSet({
      body: { title: 'Science' },
    }, {}, jest.fn())).toThrow(
      'subject is required and must be a non-empty string.'
    );
  });

  test('accepts a positive question set ID', () => {
    const next = jest.fn();

    validateQuestionSetId({
      params: { id: '5' },
    }, {}, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  test.each(['0', '-1', 'abc', '1.5', ''])(
    'rejects invalid question set ID: %s',
    (id) => {
      expect(() => validateQuestionSetId({
        params: { id },
      }, {}, jest.fn())).toThrow(
        'Question set ID must be a positive integer.'
      );
    }
  );
});