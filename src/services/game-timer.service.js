
const { conflict } = require('../errors/app-error');

// Check whether the overall game timer has expired.
async function checkGameTime(session) {
  if (!session.startTime) {
    return false;
  }

  const elapsedMs = Date.now() - new Date(session.startTime).getTime();
  const timeLimitMs = session.timeLimit * 1000;

  if (elapsedMs < timeLimitMs) {
    return false;
  }

  // Automatically close the game when its time expires.
  if (session.status === 'RUNNING') {
    await session.update({
      status: 'CLOSED',
      endTime: new Date(),
    });
  }

  throw conflict(
    'GAME_TIME_EXPIRED',
    'The 10-minute game time has expired.'
  );
}

module.exports = checkGameTime;
