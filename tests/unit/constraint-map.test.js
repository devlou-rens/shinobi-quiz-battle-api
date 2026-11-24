const constraints = require('../../src/errors/constraint-map');

describe('database constraint map', () => {
  test('maps duplicate player nicknames to a conflict response', () => {
    expect(constraints.uq_player_session_nickname).toMatchObject({
      status: 409,
      code: 'NICKNAME_TAKEN',
    });
  });

  test('maps duplicate player accounts to a conflict response', () => {
    expect(constraints.uq_player_session_user).toMatchObject({
      status: 409,
      code: 'PLAYER_ALREADY_JOINED',
    });
  });

  test('maps duplicate school IDs to a conflict response', () => {
    expect(constraints.users_school_id_key).toMatchObject({
      status: 409,
      code: 'SCHOOL_ID_EXISTS',
    });
  });

  test('maps duplicate email addresses to a conflict response', () => {
    expect(constraints.users_email_key).toMatchObject({
      status: 409,
      code: 'EMAIL_EXISTS',
    });
  });
});