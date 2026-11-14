module.exports = {
  // Week 11: Player constraints
  uq_player_session_nickname: {
    status: 409,
    code: 'NICKNAME_TAKEN',
    message: 'That nickname is already used in this game.',
  },

  uq_player_session_user: {
    status: 409,
    code: 'PLAYER_ALREADY_JOINED',
    message: 'This player has already joined the game.',
  },

  // Week 12: Account registration constraints
  users_school_id_key: {
    status: 409,
    code: 'SCHOOL_ID_EXISTS',
    message: 'This school ID is already registered.',
  },

  users_email_key: {
    status: 409,
    code: 'EMAIL_EXISTS',
    message: 'This email address is already registered.',
  },
};
