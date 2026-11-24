
jest.mock('../../src/repositories/user.repository', () => ({
  findForLogin: jest.fn(),
  findBySchoolId: jest.fn(),
  findByEmail: jest.fn(),
  create: jest.fn(),
}));
jest.mock('../../src/security/password');
jest.mock('../../src/security/token');
jest.mock('../../src/config/env', () => ({
  jwtExpiresIn: '1d',
}));

const userRepository = require('../../src/repositories/user.repository');
const password = require('../../src/security/password');
const token = require('../../src/security/token');
const authService = require('../../src/services/auth.service');

describe('auth service - login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns the same error when the school ID does not exist', async () => {
    userRepository.findForLogin.mockResolvedValue(null);
    password.matches.mockResolvedValue(false);

    await expect(
      authService.login('UNKNOWN-ID', 'wrong-password')
    ).rejects.toMatchObject({
      status: 401,
      code: 'INVALID_CREDENTIALS',
    });

    expect(password.matches).toHaveBeenCalledWith(
      'wrong-password',
      null
    );
  });

  test('returns the same error when the password is incorrect', async () => {
    userRepository.findForLogin.mockResolvedValue({
      password_hash: 'stored-hash',
    });
    password.matches.mockResolvedValue(false);

    await expect(
      authService.login('24179444', 'wrong-password')
    ).rejects.toMatchObject({
      status: 401,
      code: 'INVALID_CREDENTIALS',
    });

    expect(password.matches).toHaveBeenCalledWith(
      'wrong-password',
      'stored-hash'
    );
  });

  test('returns a token when the credentials are correct', async () => {
    const user = {
      user_id: 1,
      school_id: '24179444',
      full_name: 'Test Host',
      email: 'host@example.com',
      role: 'HOST',
      password_hash: 'stored-hash',
    };

    userRepository.findForLogin.mockResolvedValue(user);
    password.matches.mockResolvedValue(true);
    token.issue.mockReturnValue('test-token');

    const result = await authService.login(
      '24179444',
      'correct-password'
    );

    expect(result.token).toBe('test-token');
    expect(result.token_type).toBe('Bearer');
    expect(result.user).toMatchObject({
      user_id: 1,
      school_id: '24179444',
      role: 'HOST',
    });
  });
});
