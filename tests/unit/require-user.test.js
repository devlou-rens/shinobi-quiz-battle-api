const requireUser = require('../../src/middlewares/require-user');

describe('require user middleware', () => {
  test('throws unauthorized when no user exists', () => {
    const guard = requireUser('ADMIN');

    expect(() => guard({}, {}, jest.fn())).toThrow(
      expect.objectContaining({
        status: 401,
        code: 'AUTH_REQUIRED',
      })
    );
  });

  test('throws forbidden when the user has the wrong role', () => {
    const guard = requireUser('ADMIN');
    const req = { user: { role: 'PLAYER' } };

    expect(() => guard(req, {}, jest.fn())).toThrow(
      expect.objectContaining({
        status: 403,
        code: 'FORBIDDEN',
      })
    );
  });

  test('allows a user with the required role', () => {
    const guard = requireUser('ADMIN');
    const req = { user: { role: 'ADMIN' } };
    const next = jest.fn();

    guard(req, {}, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  test('compares roles without case sensitivity', () => {
    const guard = requireUser('admin');
    const req = { user: { role: 'ADMIN' } };
    const next = jest.fn();

    guard(req, {}, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  test('allows any authenticated user when no roles are specified', () => {
    const guard = requireUser();
    const req = { user: { role: 'PLAYER' } };
    const next = jest.fn();

    guard(req, {}, next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});