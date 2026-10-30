const playerService = require('../services/player.service');

async function joinSession(req, res, next) {
  try {
    const { nickname, avatar } = req.body;

    if (!nickname || !avatar) {
      return res.status(400).json({
        message: 'nickname and avatar are required.',
      });
    }

    const result = await playerService.joinSession(
      req.params.code,
      req.user.user_id,
      nickname,
      avatar
    );

    return res.status(result.rejoined ? 200 : 201).json({
      message: result.rejoined
        ? 'Player rejoined successfully.'
        : 'Player joined successfully.',
      rejoined: result.rejoined,
      player: result.player,
    });
  } catch (error) {
    next(error);
  }
}

async function getSessionPlayers(req, res, next) {
  try {
    const joinCode = req.params.code;

    // Validate the join code before querying the database.
    if (!/^\d{6}$/.test(joinCode)) {
      const error = new Error('Invalid join code format.');
      error.status = 400;
      throw error;
    }

    const players = await playerService.getSessionPlayers(joinCode);

    return res.status(200).json({ players });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  joinSession,
  getSessionPlayers,
};