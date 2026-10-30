// Last stop for any error thrown in a route.
function errorHandler(err, req, res, next) {
  console.error(err);

  const status = err.status || 500;
  const isServerFault = status >= 500;

  let code = err.code || 'BAD_REQUEST';

  if (status === 409) {
    code = 'CONFLICT';
  } else if (status === 401) {
    code = 'UNAUTHORIZED';
  } else if (status === 403) {
    code = 'FORBIDDEN';
  } else if (status === 404) {
    code = 'NOT_FOUND';
  }

  res.status(status).json({
    error: {
      code: isServerFault ? 'INTERNAL_ERROR' : code,
      message: isServerFault
        ? 'Something went wrong on the server.'
        : err.message,
    },
  });
}

module.exports = errorHandler;