
jest.mock('../../src/services/user.service', () => ({
  listUsers: jest.fn(),
  changeRole: jest.fn(),
}));

jest.mock('express-validator', () => ({
  matchedData: jest.fn(),
}));

const userService = require('../../src/services/user.service');
const { matchedData } = require('express-validator');

const {
  listUsers,
  changeRole,
} = require('../../src/controllers/user.controller');

function createResponse() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
}

afterEach(() => {
  jest.clearAllMocks();
});

describe('user controller', () => {
  describe('listUsers', () => {
    test('returns the list of users successfully', async () => {
      const users = [
        { user_id: 1, full_name: 'Student One' },
        { user_id: 2, full_name: 'Student Two' },
      ];

      userService.listUsers.mockResolvedValue(users);

      const req = {};
      const res = createResponse();
      const next = jest.fn();

      await listUsers(req, res, next);

      expect(userService.listUsers).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ users });
      expect(next).not.toHaveBeenCalled();
    });

    test('passes service errors to next', async () => {
      const error = new Error('Unable to list users');
      userService.listUsers.mockRejectedValue(error);

      const res = createResponse();
      const next = jest.fn();

      await listUsers({}, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('changeRole', () => {
    test('changes a user role successfully', async () => {
      const user = {
        user_id: 5,
        role: 'ADMIN',
      };

      matchedData.mockReturnValue({ role: 'ADMIN' });
      userService.changeRole.mockResolvedValue(user);

      const req = {
        params: { id: '5' },
        user: { user_id: 10 },
      };

      const res = createResponse();
      const next = jest.fn();

      await changeRole(req, res, next);

      expect(matchedData).toHaveBeenCalledWith(req, {
        locations: ['body'],
      });

      expect(userService.changeRole).toHaveBeenCalledWith(
        5,
        'ADMIN',
        10
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ user });
      expect(next).not.toHaveBeenCalled();
    });

    test('passes service errors to next', async () => {
      const error = new Error('Unable to change role');

      matchedData.mockReturnValue({ role: 'ADMIN' });
      userService.changeRole.mockRejectedValue(error);

      const req = {
        params: { id: '5' },
        user: { user_id: 10 },
      };

      const res = createResponse();
      const next = jest.fn();

      await changeRole(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    test('passes matchedData errors to next', async () => {
      const error = new Error('Invalid role data');

      matchedData.mockImplementation(() => {
        throw error;
      });

      const req = {
        params: { id: '5' },
        user: { user_id: 10 },
      };

      const res = createResponse();
      const next = jest.fn();

      await changeRole(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(userService.changeRole).not.toHaveBeenCalled();
    });
  });
});