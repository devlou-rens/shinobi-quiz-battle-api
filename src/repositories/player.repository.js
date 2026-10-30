const { Player } = require('../models');

// Find an existing player's seat using their account and session.
function findSeat(sessionId, userId) {
  return Player.findOne({
    where: {
      sessionId,
      user_id: userId,
    },
  });
}

// Count the players who have joined a session.
function countBySession(sessionId) {
  return Player.count({
    where: {
      sessionId,
    },
  });
}

// Create a new player.
function createPlayer(playerData) {
  return Player.create(playerData);
}

// Get the players in a session without exposing account details.
function findPlayersBySession(sessionId) {
  return Player.findAll({
    where: { sessionId },
    attributes: ['nickname', 'chakra'],
    order: [['playerId', 'ASC']],
  });
}

module.exports = {
  findSeat,
  countBySession,
  createPlayer,
  findPlayersBySession,
};