
const {
  sequelize,
  GameSession,
  Player,
  PlayerQuestion,
  Question,
  QuestionChoice,
  Answer,
} = require('../models');

const playerRepository = require('../repositories/player.repository');
const checkGameTime = require('./game-timer.service');

const {
  badRequest,
  notFound,
  conflict,
  forbidden,
} = require('../errors/app-error');

// Calculate points using server-measured elapsed time.
function pointsFor(question, isCorrect, elapsedMs) {
  const timeLimitMs = question.timeLimit * 1000;

  // Incorrect or late answers receive zero points.
  if (!isCorrect || elapsedMs > timeLimitMs) {
    return 0;
  }

  // Faster correct answers earn more points.
  return Math.round(
    1000 * (1 - elapsedMs / (2 * timeLimitMs))
  );
}

async function submitAnswer(joinCode, userId, questionId, choiceId) {
  // 1. Check that the session exists and is running.
  const session = await GameSession.findOne({
    where: { joinCode },
  });

  if (!session) {
    throw notFound('SESSION_NOT_FOUND', 'Session not found.');
  }

  // The game timer is responsible for closing expired sessions.
  await checkGameTime(session);

  if (session.status !== 'RUNNING') {
    throw conflict('GAME_NOT_RUNNING', 'The game is not running.');
  }

  // 2. Check that the user has a seat in this session.
  const player = await playerRepository.findSeat(
    session.sessionId,
    userId
  );

  if (!player) {
    throw forbidden('You must join this session before answering.');
  }

  // Validate required request values.
  if (
    !Number.isInteger(questionId) ||
    !Number.isInteger(choiceId)
  ) {
    throw badRequest(
      'INVALID_ANSWER_FIELDS',
      'question_id and choice_id must be integers.'
    );
  }

  // 3. Find this player's active question.
  const progress = await PlayerQuestion.findOne({
    where: {
      playerId: player.playerId,
      questionId,
      answeredAt: null,
    },
  });

  if (!progress) {
    throw conflict(
      'NOT_CURRENT_QUESTION',
      'This is not your current unanswered question.'
    );
  }

  const question = await Question.findOne({
    where: {
      questionId: progress.questionId,
      questionSetId: session.questionSetId,
    },
  });

  if (!question) {
    throw notFound('QUESTION_NOT_FOUND', 'Question not found.');
  }

  // 4. Check that the selected choice belongs to this question.
  const selectedChoice = await QuestionChoice.findOne({
    where: {
      choiceId,
      questionId: question.questionId,
    },
  });

  if (!selectedChoice) {
    throw badRequest(
      'INVALID_CHOICE',
      'The selected choice does not belong to this question.'
    );
  }

  // Calculate elapsed time using this player's question timer.
  const submittedAt = new Date();

  const elapsedMs =
    submittedAt.getTime() -
    new Date(progress.questionStartedAt).getTime();

  const isCorrect =
    selectedChoice.position === question.correctIndex;

  const points = pointsFor(question, isCorrect, elapsedMs);

  // Save the answer, mark the question completed,
  // and update Chakra points in one transaction.
  const result = await sequelize.transaction(async (transaction) => {
    // Lock the progress record to prevent duplicate submissions.
    const lockedProgress = await PlayerQuestion.findOne({
      where: {
        playerQuestionId: progress.playerQuestionId,
        answeredAt: null,
      },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!lockedProgress) {
      throw conflict(
        'ALREADY_ANSWERED',
        'You have already answered this question.'
      );
    }

    const answer = await Answer.create(
      {
        playerId: player.playerId,
        questionId: question.questionId,
        selectedIndex: selectedChoice.position,
        isCorrect,
        submittedAt,
      },
      { transaction }
    );

    await lockedProgress.update(
      { answeredAt: submittedAt },
      { transaction }
    );

    await Player.increment('chakra', {
      by: points,
      where: { playerId: player.playerId },
      transaction,
    });

    const updatedPlayer = await Player.findByPk(
      player.playerId,
      { transaction }
    );

    return {
      answer,
      chakra: updatedPlayer.chakra,
    };
  });

  // Return the answer result without automatically closing the game.
  return {
    answerId: result.answer.answerId,
    questionId: question.questionId,
    choiceId: selectedChoice.choiceId,
    isCorrect,
    pointsAwarded: points,
    chakra: result.chakra,
  };
}

module.exports = {
  pointsFor,
  submitAnswer,
};
