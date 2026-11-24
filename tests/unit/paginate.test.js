const { toOffset, envelope } = require('../../src/utils/paginate');

describe('pagination utilities', () => {
  test('toOffset calculates the correct offset', () => {
    expect(toOffset({ page: 2, limit: 10 })).toEqual({
      limit: 10,
      offset: 10,
    });
  });

  test('toOffset uses default page and limit values', () => {
    expect(toOffset({})).toEqual({
      limit: 10,
      offset: 0,
    });
  });

  test('envelope returns data and pagination information', () => {
    const rows = [{ id: 1 }, { id: 2 }];

    expect(envelope(rows, 23, { page: 2, limit: 10 })).toEqual({
      data: rows,
      meta: {
        page: 2,
        limit: 10,
        total: 23,
        pages: 3,
      },
    });
  });
});