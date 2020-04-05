import request from 'supertest';
import HttpStatus from 'http-status-codes';

import server from '../server';

describe('Test search api', () => {
  beforeAll(async () => {
    await server.ready();
  });

  afterAll(() => {
    server.close();
  });

  it('Should return one result', async () => {
    const response = await request(server.server).get('/search?query=whatever&limit=1&offset=0');
    expect(response.status).toEqual(HttpStatus.OK);
    expect(Object.keys(response.body).length).toEqual(1);
  });

  it('Should return multiple results', async () => {
    const response = await request(server.server).get('/search?query=whatever&limit=20&offset=0');
    expect(response.status).toEqual(HttpStatus.OK);
    expect(Object.keys(response.body).length).toEqual(20);
  });

});
