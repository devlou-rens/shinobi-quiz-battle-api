const checkGameTime = require('../../src/services/game-timer.service');

describe('game timer service', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('returns false when the game has no start time', async () => {
    const session = { startTime: null };

    await expect(checkGameTime(session)).resolves.toBe(false);
  });

  test('returns false when the game time has not expired', async () => {
    jest.spyOn(Date, 'now').mockReturnValue(100000);

    const session = {
      startTime: new Date(95000),
      timeLimit: 10,
      status: 'RUNNING',
      update: jest.fn(),
    };

    await expect(checkGameTime(session)).resolves.toBe(false);
    expect(session.update).not.toHaveBeenCalled();
  });

  test('closes a running game when its time expires', async () => {
    jest.spyOn(Date, 'now').mockReturnValue(120000);

    const session = {
      startTime: new Date(100000),
      timeLimit: 10,
      status: 'RUNNING',
      update: jest.fn().mockResolvedValue(),
    };

    await expect(checkGameTime(session)).rejects.toMatchObject({
      status: 409,
      code: 'GAME_TIME_EXPIRED',
    });

    expect(session.update).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'CLOSED',
        endTime: expect.any(Date),
      })
    );
  });

  test('does not update a game that is already closed', async () => {
    jest.spyOn(Date, 'now').mockReturnValue(120000);

    const session = {
      startTime: new Date(100000),
      timeLimit: 10,
      status: 'CLOSED',
      update: jest.fn(),
    };

    await expect(checkGameTime(session)).rejects.toMatchObject({
      status: 409,
      code: 'GAME_TIME_EXPIRED',
    });

    expect(session.update).not.toHaveBeenCalled();
  });
});