const {
  sequelize,
  GameSession,
  Player,
  PlayerQuestion,
  Question,
  QuestionChoice,
  Answer,
} = require('../models');

const {
  badRequest,
  notFound,
  conflict,
} = require('../errors/app-error');

const checkGameTime = require('./game-timer.service');

const ALLOWED_STATUSES = ['LOBBY', 'RUNNING', 'CLOSED'];

async function createSession({ hostId, questionSetId, timeLimit }) {
  if (!hostId || !questionSetId || !timeLimit) {
    throw badRequest(
      'MISSING_SESSION_FIELDS',
      'hostId, questionSetId, and timeLimit are required.'
    );
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
        current_position: null,
        question_started_at: null,
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

async function getCurrentQuestion(joinCode, userId) {
  const session = await getSessionByCode(joinCode);

  if (!session) {
    throw notFound('SESSION_NOT_FOUND', 'Session not found.');
  }

  await checkGameTime(session);

  if (session.status !== 'RUNNING') {
    throw conflict('GAME_NOT_RUNNING', 'The game is not running.');
  }

  // Find this player's seat in the session.
  const player = await Player.findOne({
    where: {
      sessionId: session.sessionId,
      user_id: userId,
    },
  });

  if (!player) {
    throw conflict(
      'PLAYER_NOT_JOINED',
      'You must join this session before requesting a question.'
    );
  }

  return sequelize.transaction(async (transaction) => {
    // Check whether this player already has an unanswered question.
    let progress = await PlayerQuestion.findOne({
      where: {
        playerId: player.playerId,
        answeredAt: null,
      },
      transaction,
    });

    // If there is no active question, select another one.
    if (!progress) {
      const totalQuestions = await Question.count({
        where: {
          questionSetId: session.questionSetId,
        },
        transaction,
      });

      if (totalQuestions === 0) {
        throw conflict(
          'NO_QUESTIONS',
          'This question set has no questions.'
        );
      }

      const completedCount = await PlayerQuestion.count({
        where: {
          playerId: player.playerId,
          answeredAt: { [require('sequelize').Op.ne]: null },
        },
        transaction,
      });

      // All questions completed: start a new cycle.
      if (completedCount >= totalQuestions) {
        await PlayerQuestion.destroy({
          where: {
            playerId: player.playerId,
          },
          transaction,
        });
      }

      // Find questions this player has not completed.
      const completedQuestions = await PlayerQuestion.findAll({
        where: {
          playerId: player.playerId,
        },
        attributes: ['questionId'],
        transaction,
      });

      const completedIds = completedQuestions.map(
        (item) => item.questionId
      );

      const availableQuestions = await Question.findAll({
        where: {
          questionSetId: session.questionSetId,
          questionId: {
            [require('sequelize').Op.notIn]: completedIds,
          },
        },
        attributes: ['questionId'],
        transaction,
      });

      if (availableQuestions.length === 0) {
        throw conflict(
          'NO_AVAILABLE_QUESTIONS',
          'No unanswered questions are available.'
        );
      }

      // Randomly select one question for this player.
      const selectedQuestion =
        availableQuestions[
          Math.floor(Math.random() * availableQuestions.length)
        ];

      progress = await PlayerQuestion.create(
        {
          playerId: player.playerId,
          questionId: selectedQuestion.questionId,
          questionStartedAt: new Date(),
          answeredAt: null,
        },
        { transaction }
      );
    }

    // Return the player's active question and its choices.
    const question = await Question.findOne({
      where: {
        questionId: progress.questionId,
      },
      attributes: [
        'questionId',
        'questionSetId',
        'text',
        'type',
        'timeLimit',
      ],
      include: [
        {
          model: QuestionChoice,
          as: 'choices',
          attributes: ['choiceId', 'choiceText', 'position'],
          required: false,
        },
      ],
      order: [
        [
          { model: QuestionChoice, as: 'choices' },
          'position',
          'ASC',
        ],
      ],
      transaction,
    });

    if (!question) {
      throw notFound('QUESTION_NOT_FOUND', 'Question not found.');
    }

    return question;
  });
}


async function updateSessionStatus(joinCode, changes = {}) {
  const { status, current_position } = changes;

  if (status !== undefined && !ALLOWED_STATUSES.includes(status)) {
    throw badRequest('INVALID_STATUS', 'Invalid session status.');
  }

  if (status === undefined && current_position === undefined) {
    throw badRequest(
      'NO_SESSION_CHANGES',
      'Provide a status or current_position.'
    );
  }

  const session = await getSessionByCode(joinCode);

  if (!session) {
    throw notFound('SESSION_NOT_FOUND', 'Session not found.');
  }

  const updates = {};

  // Handle status changes.
  if (status !== undefined) {
    const allowedTransitions = {
      LOBBY: ['RUNNING', 'CLOSED'],
      RUNNING: ['CLOSED'],
      CLOSED: [],
    };

    if (!allowedTransitions[session.status]?.includes(status)) {
      throw conflict(
        'INVALID_STATUS_TRANSITION',
        `Cannot change session status from ${session.status} to ${status}.`
      );
    }

    updates.status = status;

    if (status === 'RUNNING') {
      const now = new Date();

      updates.startTime = now;
      updates.current_position = 1;
      updates.question_started_at = now;
    }

    if (status === 'CLOSED') {
      updates.endTime = new Date();
    }
  }

  // Handle moving to the next shared question position.
  if (current_position !== undefined) {
    if (!Number.isInteger(current_position) || current_position < 1) {
      throw badRequest(
        'INVALID_CURRENT_POSITION',
        'current_position must be a positive integer.'
      );
    }

    if (session.status !== 'RUNNING') {
      throw conflict(
        'GAME_NOT_RUNNING',
        'The game must be running to advance questions.'
      );
    }

    const totalQuestions = await Question.count({
      where: { questionSetId: session.questionSetId },
    });

    if (current_position > totalQuestions) {
      throw conflict(
        'NO_MORE_QUESTIONS',
        'There are no more questions in this game.'
      );
    }

    const nextPosition = (session.current_position || 0) + 1;

    if (current_position !== nextPosition) {
      throw conflict(
        'NOT_NEXT_QUESTION',
        'You can only advance to the next question.'
      );
    }

    updates.current_position = current_position;
    updates.question_started_at = new Date();
  }

  await session.update(updates);

  return session;
}


module.exports = {
  createSession,
  getSessionByCode,
  getCurrentQuestion,
  updateSessionStatus,
};