
jest.mock('../../src/models', () => ({
  sequelize: {
    transaction: jest.fn(async (callback) => callback({})),
  },
  GameSession: {
    findOne: jest.fn(),
  },
  Player: {
    findOne: jest.fn(),
  },
  PlayerQuestion: {
    findOne: jest.fn(),
    findAll: jest.fn(),
    count: jest.fn(),
    destroy: jest.fn(),
    create: jest.fn(),
  },
  Question: {
    count: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
  },
  QuestionChoice: {},
}));

jest.mock('../../src/services/game-timer.service', () =>
  jest.fn().mockResolvedValue(false)
);

const {
  getCurrentQuestion,
  updateSessionStatus,
} = require('../../src/services/session.service');

const {
  GameSession,
  Player,
  PlayerQuestion,
  Question,
} = require('../../src/models');

const checkGameTime = require('../../src/services/game-timer.service');

const session = {
  sessionId: 1,
  questionSetId: 1,
  status: 'RUNNING',
  hostId: 20,
};

const player = {
  playerId: 10,
  user_id: 20,
};

beforeEach(() => {
  jest.clearAllMocks();

  session.status = 'RUNNING';
  session.hostId = 20;

  session.update = jest.fn(async function (updates) {
    Object.assign(this, updates);
    return this;
  });

  GameSession.findOne.mockResolvedValue(session);
  Player.findOne.mockResolvedValue(player);
});

describe('session service - question cycle', () => {
  test('returns the existing unanswered question', async () => {
    const activeProgress = {
      playerId: 10,
      questionId: 1,
      answeredAt: null,
    };

    const question = {
      questionId: 1,
      text: 'Sample question',
      choices: [],
    };

    PlayerQuestion.findOne.mockResolvedValue(activeProgress);
    Question.findOne.mockResolvedValue(question);

    const result = await getCurrentQuestion('123456', 20);

    expect(result).toBe(question);
    expect(PlayerQuestion.create).not.toHaveBeenCalled();
    expect(Question.count).not.toHaveBeenCalled();
    expect(checkGameTime).toHaveBeenCalledWith(session);
  });

  test('selects an unanswered question before repeating completed questions', async () => {
    PlayerQuestion.findOne.mockResolvedValue(null);
    Question.count.mockResolvedValue(2);
    PlayerQuestion.count.mockResolvedValue(1);

    PlayerQuestion.findAll.mockResolvedValue([
      { questionId: 1 },
    ]);

    Question.findAll.mockResolvedValue([
      { questionId: 2 },
    ]);

    PlayerQuestion.create.mockResolvedValue({
      playerId: 10,
      questionId: 2,
      answeredAt: null,
    });

    const question = {
      questionId: 2,
      text: 'Second question',
      choices: [],
    };

    Question.findOne.mockResolvedValue(question);

    const result = await getCurrentQuestion('123456', 20);

    expect(result).toBe(question);

    expect(PlayerQuestion.create).toHaveBeenCalledWith(
      expect.objectContaining({
        playerId: 10,
        questionId: 2,
        answeredAt: null,
      }),
      expect.any(Object)
    );

    expect(PlayerQuestion.destroy).not.toHaveBeenCalled();
  });

  test('resets completed progress and starts a new question cycle', async () => {
    PlayerQuestion.findOne.mockResolvedValue(null);
    Question.count.mockResolvedValue(2);
    PlayerQuestion.count.mockResolvedValue(2);

    PlayerQuestion.findAll.mockResolvedValue([]);

    Question.findAll.mockResolvedValue([
      { questionId: 1 },
      { questionId: 2 },
    ]);

    PlayerQuestion.create.mockResolvedValue({
      playerId: 10,
      questionId: 1,
      answeredAt: null,
    });

    const question = {
      questionId: 1,
      text: 'Repeated question',
      choices: [],
    };

    Question.findOne.mockResolvedValue(question);

    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0);

    try {
      const result = await getCurrentQuestion('123456', 20);

      expect(result).toBe(question);

      expect(PlayerQuestion.destroy).toHaveBeenCalledWith({
        where: { playerId: 10 },
        transaction: expect.any(Object),
      });

      expect(PlayerQuestion.create).toHaveBeenCalledWith(
        expect.objectContaining({
          playerId: 10,
          questionId: 1,
          answeredAt: null,
        }),
        expect.any(Object)
      );
    } finally {
      randomSpy.mockRestore();
    }
  });
});

describe('session service - update session authorization', () => {
  test('allows the session host to close their own session', async () => {
    const result = await updateSessionStatus(
      '123456',
      { status: 'CLOSED' },
      { userId: 20, role: 'HOST' }
    );

    expect(result.status).toBe('CLOSED');

    expect(session.update).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'CLOSED' })
    );
  });

  test('prevents another host from closing the session', async () => {
    await expect(
      updateSessionStatus(
        '123456',
        { status: 'CLOSED' },
        { userId: 30, role: 'HOST' }
      )
    ).rejects.toThrow(
      'Only the session host or an admin may update this session.'
    );

    expect(session.update).not.toHaveBeenCalled();
  });

  test('allows an admin to close another host session', async () => {
    const result = await updateSessionStatus(
      '123456',
      { status: 'CLOSED' },
      { userId: 99, role: 'ADMIN' }
    );

    expect(result.status).toBe('CLOSED');

    expect(session.update).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'CLOSED' })
    );
  });
});
