
jest.mock('../../src/models', () => ({
  sequelize: { transaction: jest.fn() },
  GameSession: { findOne: jest.fn() },
  Player: { increment: jest.fn(), findByPk: jest.fn() },
  PlayerQuestion: { findOne: jest.fn() },
  Question: { findOne: jest.fn(), count: jest.fn() },
  QuestionChoice: { findOne: jest.fn() },
  Answer: { create: jest.fn(), count: jest.fn() },
}));

jest.mock('../../src/repositories/player.repository', () => ({
  findSeat: jest.fn(),
}));

jest.mock('../../src/services/game-timer.service', () =>
  jest.fn().mockResolvedValue()
);

const { pointsFor, submitAnswer } = require('../../src/services/answer.service');
const { GameSession, sequelize, Answer } = require('../../src/models');
const playerRepository = require('../../src/repositories/player.repository');

describe('answer submission security', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('rejects a user who has not joined the session before recording an answer', async () => {
    GameSession.findOne.mockResolvedValue({
      sessionId: 1,
      questionSetId: 1,
      status: 'RUNNING',
    });

    playerRepository.findSeat.mockResolvedValue(null);

    await expect(
      submitAnswer('TEST123', 999, 1, 1)
    ).rejects.toMatchObject({
      status: 403,
    });

    expect(sequelize.transaction).not.toHaveBeenCalled();
    expect(Answer.create).not.toHaveBeenCalled();
  });
});


describe('answer service - pointsFor', () => {
  const question = { timeLimit: 10 };

  test('awards maximum points for an immediate correct answer', () => {
    expect(pointsFor(question, true, 0)).toBe(1000);
  });

  test('awards 750 points for a correct answer halfway through the time limit', () => {
    expect(pointsFor(question, true, 5000)).toBe(750);
  });

  test('awards 500 points for a correct answer exactly at the time limit', () => {
    expect(pointsFor(question, true, 10000)).toBe(500);
  });

  test('awards zero points for a late correct answer', () => {
    expect(pointsFor(question, true, 10001)).toBe(0);
  });

  test('awards zero points for an incorrect answer', () => {
    expect(pointsFor(question, false, 1000)).toBe(0);
  });
});
