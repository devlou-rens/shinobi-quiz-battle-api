const {
  UniqueConstraintError,
  ForeignKeyConstraintError,
} = require('sequelize');

function constraintOf(error) {
  if (
    error instanceof UniqueConstraintError ||
    error instanceof ForeignKeyConstraintError
  ) {
    return (
      (error.parent && error.parent.constraint) ||
      error.index ||
      'unknown'
    );
  }

  return null;
}

module.exports = { constraintOf };