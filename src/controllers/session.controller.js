const sessionService = require('../services/session.service');

async function createSession(req, res, next) {
  try {
    const session = await sessionService.createSession({
    hostId: req.user.user_id,
    questionSetId: req.body.questionSetId,
    timeLimit: req.body.timeLimit,
    });

    return res.status(201).json({
      message: 'Session created successfully.',
      session,
    });
  } catch (error) {
    next(error);
  }
}

async function getSession(req, res, next) {
  try {
    const joinCode = req.params.code;

    // Check that the join code contains exactly six digits.
    if (!/^\d{6}$/.test(joinCode)) {
      const error = new Error('Invalid join code format.');
      error.status = 400;
      throw error;
    }

    const session = await sessionService.getSessionByCode(joinCode);

    if (!session) {
    const error = new Error('Session not found.');
    error.status = 404;
    throw error;
    }

    return res.status(200).json({ session });
  } catch (error) {
    next(error);
  }
}

async function getCurrentQuestion(req, res, next) {
  try {
    const question = await sessionService.getCurrentQuestion(
      req.params.code,
      req.user.user_id
    );

    return res.status(200).json({ question });
  } catch (error) {
    next(error);
  }
}

async function updateSessionStatus(req, res, next) {
  try {
    const session = await sessionService.updateSessionStatus(
      req.params.code,
      {
        status: req.body.status,
        current_position: req.body.current_position,
      }
    );

    return res.status(200).json({
      message: 'Session updated successfully.',
      session,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createSession,
  getSession,
  getCurrentQuestion,
  updateSessionStatus,
};