import request from 'supertest';

import server from '../server';

describe('Test auth api', () => {
  beforeAll(async () => {
    await server.ready();
  });

  afterAll(() => {
    server.close();
  });

  it('Should redirect to Spotify login', async () => {
    const response = await request(server.server).get('/login');
    expect(response.status).toEqual(302);
  });

  // more tests to be added when token handling is clear
});
