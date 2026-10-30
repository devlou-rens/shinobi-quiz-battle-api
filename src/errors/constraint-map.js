module.exports = {
  // Add your actual database constraint names here.
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
};