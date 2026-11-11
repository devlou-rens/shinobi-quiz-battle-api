const { Router } = require('express');
const sessionController = require('../controllers/session.controller');
const playerController = require('../controllers/player.controller');
const currentUser = require('../middlewares/current-user');
const requireUser = require('../middlewares/require-user');

const router = Router();

// Identify the caller for every session route.
router.use(currentUser);

// Create a session: only a host or admin may create one.
router.post('/', requireUser('HOST', 'ADMIN'), sessionController.createSession);

// Retrieve a session using its join code.
router.get('/:code', sessionController.getSession);

// Update session status: only a host or admin may do this.
router.patch('/:code', requireUser('HOST', 'ADMIN'), sessionController.updateSessionStatus);

// Join a session or rejoin as the same user.
router.post('/:code/players', playerController.joinSession);

// List players in a session.
router.get('/:code/players', playerController.getSessionPlayers);

module.exports = router;