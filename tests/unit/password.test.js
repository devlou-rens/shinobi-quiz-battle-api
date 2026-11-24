const { hash, matches } = require('../../src/security/password');

describe('password security', () => {
  test('hash creates a password hash', async () => {
    const passwordHash = await hash('TestPassword123');

    expect(passwordHash).not.toBe('TestPassword123');
    expect(passwordHash).toMatch(/^\$2[aby]\$/);
  });

  test('matches returns true for the correct password', async () => {
    const passwordHash = await hash('TestPassword123');

    await expect(matches('TestPassword123', passwordHash)).resolves.toBe(true);
  });

  test('matches returns false for an incorrect password', async () => {
    const passwordHash = await hash('TestPassword123');

    await expect(matches('WrongPassword123', passwordHash)).resolves.toBe(false);
  });

  test('matches returns false when no password hash exists', async () => {
    await expect(matches('TestPassword123', null)).resolves.toBe(false);
  });
});