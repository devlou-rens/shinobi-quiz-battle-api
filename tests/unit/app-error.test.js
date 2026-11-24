const {
  AppError,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  conflict,
} = require('../../src/errors/app-error');

describe('application errors', () => {
  test('AppError stores its status, code, message, and details', () => {
    const error = new AppError(400, 'INVALID_INPUT', 'Invalid input', {
      field: 'name',
    });

    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('AppError');
    expect(error.status).toBe(400);
    expect(error.code).toBe('INVALID_INPUT');
    expect(error.message).toBe('Invalid input');
    expect(error.details).toEqual({ field: 'name' });
  });

  test('badRequest creates a 400 error', () => {
    expect(badRequest('BAD_INPUT', 'Invalid data')).toMatchObject({
      status: 400,
      code: 'BAD_INPUT',
      message: 'Invalid data',
    });
  });

  test('unauthorized creates a 401 error with default values', () => {
    expect(unauthorized()).toMatchObject({
      status: 401,
      code: 'AUTH_REQUIRED',
    });
  });

  test('forbidden creates a 403 error', () => {
    expect(forbidden()).toMatchObject({
      status: 403,
      code: 'FORBIDDEN',
    });
  });

  test('notFound creates a 404 error', () => {
    expect(notFound('NOT_FOUND', 'Record not found')).toMatchObject({
      status: 404,
      code: 'NOT_FOUND',
      message: 'Record not found',
    });
  });

  test('conflict creates a 409 error', () => {
    expect(conflict('GAME_TIME_EXPIRED', 'Time expired')).toMatchObject({
      status: 409,
      code: 'GAME_TIME_EXPIRED',
      message: 'Time expired',
    });
  });
});