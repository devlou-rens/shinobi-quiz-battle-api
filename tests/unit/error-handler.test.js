
const {
  UniqueConstraintError,
  ForeignKeyConstraintError,
} = require('sequelize');

const errorHandler = require('../../src/middlewares/error-handler');
const constraintMap = require('../../src/errors/constraint-map');

function createResponse() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
}

afterEach(() => {
  jest.restoreAllMocks();
});

describe('error handler middleware', () => {
  test('returns the mapped response for a known database constraint', () => {
    const constraint = Object.keys(constraintMap)[0];
    const known = constraintMap[constraint];

    jest.spyOn(console, 'error').mockImplementation(() => {});

    const error = new UniqueConstraintError({
      message: 'Database conflict',
      parent: { constraint },
    });

    const res = createResponse();

    errorHandler(error, {}, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(known.status);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        code: known.code,
        message: known.message,
      },
    });
  });

  test('returns a generic conflict for an unknown database constraint', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});

    const error = new ForeignKeyConstraintError({
      message: 'Database conflict',
      parent: { constraint: 'unknown_constraint' },
    });

    const res = createResponse();

    errorHandler(error, {}, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        code: 'CONFLICT',
        message: 'That change conflicts with data that already exists.',
      },
    });
  });

  test('returns a bad request for invalid JSON', () => {
    const error = new Error('Invalid JSON');
    error.type = 'entity.parse.failed';

    const res = createResponse();

    errorHandler(error, {}, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        code: 'INVALID_JSON',
        message: 'The request body is not valid JSON.',
      },
    });
  });

  test('returns a client error with details when provided', () => {
    const error = new Error('Email is invalid.');
    error.status = 400;
    error.code = 'VALIDATION_FAILED';
    error.details = [{ field: 'email', message: 'Email is invalid.' }];

    const res = createResponse();

    errorHandler(error, {}, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        code: 'VALIDATION_FAILED',
        message: 'Email is invalid.',
        details: [{ field: 'email', message: 'Email is invalid.' }],
      },
    });
  });

  test('returns a generic server error for unexpected errors', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});

    const error = new Error('Sensitive internal database information');
    const res = createResponse();

    errorHandler(error, {}, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Something went wrong on the server.',
      },
    });
  });

  test('uses the supplied status for other client errors', () => {
    const error = new Error('Access denied.');
    error.status = 403;
    error.code = 'FORBIDDEN';

    const res = createResponse();

    errorHandler(error, {}, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        code: 'FORBIDDEN',
        message: 'Access denied.',
      },
    });
  });
});
