const { GameSession } = require('../models');

const ALLOWED_STATUSES = ['LOBBY', 'RUNNING', 'CLOSED'];

async function createSession({ hostId, questionSetId, timeLimit }) {
  if (!hostId || !questionSetId || !timeLimit) {
    const error = new Error(
      'hostId, questionSetId, and timeLimit are required.'
    );
    error.status = 400;
    throw error;
  }

  for (let attempt = 0; attempt < 5; attempt++) {
    const joinCode = String(
      Math.floor(100000 + Math.random() * 900000)
    );

    try {
      return await GameSession.create({
        hostId,
        questionSetId,
        timeLimit,
        joinCode,
        status: 'LOBBY',
        startTime: null,
        endTime: null,
      });
    } catch (error) {
      if (
        error.name === 'SequelizeUniqueConstraintError' &&
        attempt < 4
      ) {
        continue;
      }

      throw error;
    }
  }

  throw new Error('Unable to generate a unique join code.');
}

async function getSessionByCode(joinCode) {
  return GameSession.findOne({
    where: { joinCode },
  });
}

async function updateSessionStatus(joinCode, newStatus) {
  if (!ALLOWED_STATUSES.includes(newStatus)) {
    const error = new Error('Invalid session status.');
    error.status = 400;
    throw error;
  }

  const session = await getSessionByCode(joinCode);

  if (!session) {
    const error = new Error('Session not found.');
    error.status = 404;
    throw error;
  }

  const allowedTransitions = {
    LOBBY: ['RUNNING', 'CLOSED'],
    RUNNING: ['CLOSED'],
    CLOSED: [],
  };

    if (!allowedTransitions[session.status]?.includes(newStatus)) {
    const error = new Error(
        `Cannot change session status from ${session.status} to ${newStatus}.`
    );
    error.status = 409;
    throw error;
    }

  const updates = { status: newStatus };

  if (newStatus === 'RUNNING') {
    updates.startTime = new Date();
  }

  if (newStatus === 'CLOSED') {
    updates.endTime = new Date();
  }

  await session.update(updates);

  return session;
}

module.exports = {
  createSession,
  getSessionByCode,
  updateSessionStatus,
};