const { GameSession } = require('../models');
const playerRepository = require('../repositories/player.repository');

async function joinSession(joinCode, userId, nickname, avatar) {
  const session = await GameSession.findOne({
    where: { joinCode },
  });

  if (!session) {
    const error = new Error('Session not found.');
    error.status = 404;
    throw error;
  }

  // Check whether this account already has a seat.
  // An existing player can rejoin even if the session has started or closed.
  const existingPlayer = await playerRepository.findSeat(
    session.sessionId,
    userId
  );

  if (existingPlayer) {
    return {
      player: existingPlayer,
      session: {
        sessionId: session.sessionId,
        joinCode: session.joinCode,
        status: session.status,
      },
      rejoined: true,
    };
  }

  // Validate the nickname when creating a new seat.
  if (typeof nickname !== 'string' || nickname.trim().length < 2) {
    const error = new Error(
      'Nickname must be at least 2 characters long.'
    );
    error.status = 400;
    throw error;
  }

  // Only new players may join an open lobby.
  if (session.status === 'CLOSED') {
    const error = new Error('This session has ended.');
    error.status = 409;
    throw error;
  }

  if (session.status === 'RUNNING') {
    const error = new Error('This session has already started.');
    error.status = 409;
    throw error;
  }

  let player;

  try {
    player = await playerRepository.createPlayer({
      sessionId: session.sessionId,
      user_id: userId,
      nickname: nickname.trim(),
      avatar,
      chakra: 0,
    });
  } catch (error) {
    if (
      error.name === 'SequelizeUniqueConstraintError' &&
      (
        error.parent?.constraint === 'uq_player_session_nickname' ||
        error.fields?.nickname
      )
    ) {
      const conflict = new Error(
        'This nickname is already taken in this session.'
      );
      conflict.status = 409;
      conflict.code = 'CONFLICT';
      throw conflict;
    }

    throw error;
  }

  return {
    player,
    session: {
      sessionId: session.sessionId,
      joinCode: session.joinCode,
      status: session.status,
    },
    rejoined: false,
  };
}

async function getSessionPlayers(joinCode) {
  const session = await GameSession.findOne({
    where: { joinCode },
  });

  if (!session) {
    const error = new Error('Session not found.');
    error.status = 404;
    throw error;
  }

  return playerRepository.findPlayersBySession(session.sessionId);
}

module.exports = {
  joinSession,
  getSessionPlayers,
};