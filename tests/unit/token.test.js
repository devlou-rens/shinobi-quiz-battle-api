const { issue, verify } = require('../../src/security/token');

describe('JWT token security', () => {
  test('issue creates a token for a user', () => {
    const token = issue({
      user_id: 1,
      role: 'PLAYER',
    });

    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(0);
  });

  test('verify returns the user information from a valid token', () => {
    const token = issue({
      user_id: 1,
      role: 'PLAYER',
    });

    const decoded = verify(token);

    expect(decoded.sub).toBe('1');
    expect(decoded.role).toBe('PLAYER');
  });

  test('verify rejects an invalid token', () => {
    expect(() => verify('invalid-token')).toThrow();
  });
});