// Last stop for any error thrown in a route.
const { constraintOf } = require('../errors/db-errors');
const constraintMap = require('../errors/constraint-map');

function errorHandler(err, req, res, next) {
  console.error(err);

  // Translate database constraint violations into safe API errors.
  const constraint = constraintOf(err);

  if (constraint) {
    const mapped = constraintMap[constraint];

    if (mapped) {
      return res.status(mapped.status).json({
        error: {
          code: mapped.code,
          message: mapped.message,
        },
      });
    }

    // Unmapped UNIQUE or foreign key violations still return 409.
    return res.status(409).json({
      error: {
        code: 'CONFLICT',
        message: 'The request conflicts with existing data.',
      },
    });
  }

  const status = err.status || 500;

  let code = err.code || 'BAD_REQUEST';

  if (status === 401) {
    code = 'UNAUTHORIZED';
  } else if (status === 403) {
    code = 'FORBIDDEN';
  } else if (status === 404) {
    code = 'NOT_FOUND';
  }

  res.status(status).json({
    error: {
      code: status >= 500 ? 'INTERNAL_ERROR' : code,
      message:
        status >= 500
          ? 'Something went wrong on the server.'
          : err.message,
    },
  });
}

module.exports = errorHandler;