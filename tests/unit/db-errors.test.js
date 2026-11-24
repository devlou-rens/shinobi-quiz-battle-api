const {
  UniqueConstraintError,
  ForeignKeyConstraintError,
} = require('sequelize');

const { constraintOf } = require('../../src/errors/db-errors');

describe('database constraint errors', () => {
  test('returns the constraint name from a unique constraint error', () => {
    const error = new UniqueConstraintError({
      message: 'Duplicate value',
      parent: { constraint: 'users_school_id_key' },
    });

    expect(constraintOf(error)).toBe('users_school_id_key');
  });

  test('returns the constraint name from a foreign key error', () => {
    const error = new ForeignKeyConstraintError({
      message: 'Invalid reference',
      parent: { constraint: 'player_user_id_fkey' },
    });

    expect(constraintOf(error)).toBe('player_user_id_fkey');
  });

  test('uses the index when the parent constraint is missing', () => {
  const error = new UniqueConstraintError({
    message: 'Duplicate value',
    parent: {},
  });

  error.index = 'test_unique_index';

  expect(constraintOf(error)).toBe('test_unique_index');
});

  test('returns unknown when the constraint name is unavailable', () => {
    const error = new UniqueConstraintError({
      message: 'Duplicate value',
      parent: {},
    });

    expect(constraintOf(error)).toBe('unknown');
  });

  test('returns null for an ordinary error', () => {
    expect(constraintOf(new Error('Something went wrong'))).toBeNull();
  });
});