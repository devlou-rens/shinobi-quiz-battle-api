
const { Router } = require('express');
const sessionController = require('../controllers/session.controller');
const playerController = require('../controllers/player.controller');
const currentUser = require('../middlewares/current-user');
const answerController = require('../controllers/answer.controller');
const requireUser = require('../middlewares/require-user');

const router = Router();

// Identify the caller for every session route.
router.use(currentUser);

// Create a session: only a host or admin may create one.
router.post(
  '/',
  requireUser('HOST', 'ADMIN'),
  sessionController.createSession
);

// Submit an answer.
router.post(
  '/:code/answers',
  requireUser(),
  answerController.submitAnswer
);

// Retrieve a session using its join code.
router.get('/:code', sessionController.getSession);

// Retrieve the current question and its choices.
router.get(
  '/:code/question',
  requireUser(),
  sessionController.getCurrentQuestion
);

// Update session status: only a host or admin may do this.
router.patch(
  '/:code',
  requireUser('HOST', 'ADMIN'),
  sessionController.updateSessionStatus
);

// Join a session or rejoin as the same user.
router.post(
  '/:code/players',
  requireUser(),
  playerController.joinSession
);

// List players in a session.
router.get('/:code/players', playerController.getSessionPlayers);

// Retrieve the session leaderboard.
router.get('/:code/leaderboard', playerController.getLeaderboard);

module.exports = router;