
jest.mock('../../src/services/question-bank.service', () => ({
  listQuestions: jest.fn(),
  createQuestion: jest.fn(),
  updateQuestion: jest.fn(),
  deleteQuestion: jest.fn(),
}));

jest.mock('../../src/utils/paginate', () => ({
  envelope: jest.fn((rows, count, options) => ({
    data: rows,
    pagination: { count, ...options },
  })),
}));

const questionBankService = require('../../src/services/question-bank.service');
const { envelope } = require('../../src/utils/paginate');

const {
  listQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} = require('../../src/controllers/question-bank.controller');

describe('question-bank controller', () => {
  let req;
  let res;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      params: { id: '5', questionId: '12' },
      user: { user_id: 7 },
      query: {},
      body: {
        text: 'What is JavaScript?',
        type: 'MULTIPLE_CHOICE',
        choices: [],
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      end: jest.fn().mockReturnThis(),
    };
  });

  test('lists questions with pagination and search options', async () => {
    req.query = {
      page: '2',
      limit: '5',
      sort: 'text',
      order: 'desc',
      search: 'JavaScript',
    };

    const rows = [{ questionId: 12, text: 'What is JavaScript?' }];

    questionBankService.listQuestions.mockResolvedValue({
      rows,
      count: 1,
    });

    await listQuestions(req, res);

    expect(questionBankService.listQuestions).toHaveBeenCalledWith(
      '5',
      7,
      {
        page: 2,
        limit: 5,
        sort: 'text',
        order: 'desc',
        search: 'JavaScript',
      }
    );

    expect(envelope).toHaveBeenCalledWith(rows, 1, {
      page: 2,
      limit: 5,
      sort: 'text',
      order: 'desc',
      search: 'JavaScript',
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });

  test('uses default pagination options when query is empty', async () => {
    questionBankService.listQuestions.mockResolvedValue({
      rows: [],
      count: 0,
    });

    await listQuestions(req, res);

    expect(questionBankService.listQuestions).toHaveBeenCalledWith(
      '5',
      7,
      {
        page: 1,
        limit: 10,
        sort: 'questionId',
        order: 'asc',
        search: undefined,
      }
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });

  test('creates a question successfully', async () => {
    const question = { questionId: 12, text: 'What is JavaScript?' };

    questionBankService.createQuestion.mockResolvedValue(question);

    await createQuestion(req, res);

    expect(questionBankService.createQuestion).toHaveBeenCalledWith(
      '5',
      req.body,
      7
    );

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ data: question });
  });

  test('updates a question successfully', async () => {
    const question = { questionId: 12, text: 'Updated question' };

    questionBankService.updateQuestion.mockResolvedValue(question);

    await updateQuestion(req, res);

    expect(questionBankService.updateQuestion).toHaveBeenCalledWith(
      '5',
      '12',
      req.body,
      7
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: question });
  });

  test('deletes a question successfully', async () => {
    questionBankService.deleteQuestion.mockResolvedValue();

    await deleteQuestion(req, res);

    expect(questionBankService.deleteQuestion).toHaveBeenCalledWith(
      '5',
      '12',
      7
    );

    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.end).toHaveBeenCalled();
  });
});
