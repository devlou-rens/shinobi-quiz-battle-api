class AppError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.name = 'AppError';
    this.status = status;
  }
}

function unauthorized(message = 'Authentication required.') {
  return new AppError(message, 401);
}

function forbidden(message = 'Access denied.') {
  return new AppError(message, 403);
}

function badRequest(message = 'Bad request.') {
  return new AppError(message, 400);
}

function notFound(message = 'Resource not found.') {
  return new AppError(message, 404);
}

module.exports = {
  AppError,
  unauthorized,
  forbidden,
  badRequest,
  notFound,
};