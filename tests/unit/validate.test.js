jest.mock('express-validator', () => ({
  validationResult: jest.fn(),
}));

const { validationResult } = require('express-validator');
const validate = require('../../src/middlewares/validate');

describe('validation middleware', () => {
  test('calls next when there are no validation errors', () => {
    validationResult.mockReturnValue({
      isEmpty: () => true,
    });

    const next = jest.fn();

    validate({}, {}, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  test('throws a validation error when input is invalid', () => {
    validationResult.mockReturnValue({
      isEmpty: () => false,
      array: () => [
        { path: 'email', msg: 'Email is invalid.' },
      ],
    });

    expect(() => validate({}, {}, jest.fn())).toThrow(
      expect.objectContaining({
        status: 400,
        code: 'VALIDATION_FAILED',
        message: 'Email is invalid.',
      })
    );
  });

  test('uses body when a validation problem has no path', () => {
    validationResult.mockReturnValue({
      isEmpty: () => false,
      array: () => [
        { msg: 'Invalid request.' },
      ],
    });

    try {
      validate({}, {}, jest.fn());
    } catch (error) {
      expect(error.details).toEqual([
        { field: 'body', message: 'Invalid request.' },
      ]);
    }
  });
});