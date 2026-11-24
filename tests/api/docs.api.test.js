const { app, request } = require('../setup/helpers');

describe('API documentation endpoints', () => {
  test('returns the OpenAPI specification as JSON', async () => {
    const response = await request(app)
      .get('/api/v1/openapi.json')
      .expect(200)
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('openapi');
    expect(response.body).toHaveProperty('info');
    expect(response.body.info).toHaveProperty('version');
    expect(response.body.info.version).toBe(
      require('../../package.json').version
    );
  });

  test('serves the Swagger UI documentation', async () => {
    const response = await request(app)
      .get('/api/v1/docs/')
      .expect(200);

    expect(response.text).toContain('swagger-ui');
  });
});