
jest.mock('../../src/services/question-set.service', () => ({
  listQuestionSets: jest.fn(),
  getQuestionSet: jest.fn(),
  createQuestionSet: jest.fn(),
  updateQuestionSet: jest.fn(),
  uploadQuestionSetCover: jest.fn(),
  deleteQuestionSet: jest.fn(),
}));

jest.mock('express-validator', () => ({
  matchedData: jest.fn(),
}));

const questionSetService = require('../../src/services/question-set.service');
const { matchedData } = require('express-validator');
const {
  listQuestionSets,
  getQuestionSet,
  createQuestionSet,
  updateQuestionSet,
  uploadCover,
  deleteQuestionSet,
} = require('../../src/controllers/question-set.controller');

function createResponse() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    end: jest.fn().mockReturnThis(),
  };
}

afterEach(() => {
  jest.clearAllMocks();
});

describe('question-set controller', () => {
  test('lists question sets with pagination', async () => {
    const rows = [{ questionSetId: 1, title: 'Science' }];

    matchedData.mockReturnValue({ page: 2, limit: 5 });
    questionSetService.listQuestionSets.mockResolvedValue({
      rows,
      count: 11,
    });

    const req = { user: { user_id: 7 } };
    const res = createResponse();

    await listQuestionSets(req, res);

    expect(matchedData).toHaveBeenCalledWith(req, {
      locations: ['query'],
    });
    expect(questionSetService.listQuestionSets).toHaveBeenCalledWith(
      7,
      { page: 2, limit: 5 }
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      data: rows,
      meta: {
        page: 2,
        limit: 5,
        total: 11,
        pages: 3,
      },
    });
  });

  test('uses default pagination when options are missing', async () => {
    matchedData.mockReturnValue({});
    questionSetService.listQuestionSets.mockResolvedValue({
      rows: [],
      count: 0,
    });

    const req = { user: { user_id: 7 } };
    const res = createResponse();

    await listQuestionSets(req, res);

    expect(questionSetService.listQuestionSets).toHaveBeenCalledWith(7, {});
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      data: [],
      meta: {
        page: 1,
        limit: 10,
        total: 0,
        pages: 0,
      },
    });
  });

  test('gets a question set without including questions', async () => {
    const questionSet = { questionSetId: 3, title: 'Math' };
    questionSetService.getQuestionSet.mockResolvedValue(questionSet);

    const req = {
      params: { id: '3' },
      query: {},
      user: { user_id: 7 },
    };
    const res = createResponse();

    await getQuestionSet(req, res);

    expect(questionSetService.getQuestionSet).toHaveBeenCalledWith(
      '3',
      7,
      { includeQuestions: false }
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: questionSet });
  });

  test('gets a question set with questions when requested', async () => {
    const questionSet = {
      questionSetId: 3,
      title: 'Math',
      questions: [],
    };

    questionSetService.getQuestionSet.mockResolvedValue(questionSet);

    const req = {
      params: { id: '3' },
      query: { include: 'questions' },
      user: { user_id: 7 },
    };
    const res = createResponse();

    await getQuestionSet(req, res);

    expect(questionSetService.getQuestionSet).toHaveBeenCalledWith(
      '3',
      7,
      { includeQuestions: true }
    );
    expect(res.json).toHaveBeenCalledWith({ data: questionSet });
  });

  test('creates a question set', async () => {
    const body = { title: 'Science', subject: 'General Science' };
    const questionSet = { questionSetId: 4, ...body };

    questionSetService.createQuestionSet.mockResolvedValue(questionSet);

    const req = { body, user: { user_id: 7 } };
    const res = createResponse();

    await createQuestionSet(req, res);

    expect(questionSetService.createQuestionSet).toHaveBeenCalledWith(
      body,
      7
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ data: questionSet });
  });

  test('updates a question set', async () => {
    const body = { title: 'Updated Science' };
    const questionSet = { questionSetId: 4, ...body };

    questionSetService.updateQuestionSet.mockResolvedValue(questionSet);

    const req = {
      params: { id: '4' },
      body,
      user: { user_id: 7 },
    };
    const res = createResponse();

    await updateQuestionSet(req, res);

    expect(questionSetService.updateQuestionSet).toHaveBeenCalledWith(
      '4',
      body,
      7
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: questionSet });
  });

  test('uploads a question set cover image', async () => {
    const questionSet = { questionSetId: 4 };
    questionSetService.uploadQuestionSetCover.mockResolvedValue(questionSet);

    const req = {
      params: { id: '4' },
      file: { filename: 'science-cover.png' },
      user: { user_id: 7 },
    };
    const res = createResponse();

    await uploadCover(req, res);

    expect(questionSetService.uploadQuestionSetCover).toHaveBeenCalledWith(
      '4',
      '/uploads/covers/science-cover.png',
      7
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: questionSet });
  });

  test('deletes a question set', async () => {
    questionSetService.deleteQuestionSet.mockResolvedValue(undefined);

    const req = {
      params: { id: '4' },
      user: { user_id: 7 },
    };
    const res = createResponse();

    await deleteQuestionSet(req, res);

    expect(questionSetService.deleteQuestionSet).toHaveBeenCalledWith(
      '4',
      7
    );
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.end).toHaveBeenCalledTimes(1);
  });
});
