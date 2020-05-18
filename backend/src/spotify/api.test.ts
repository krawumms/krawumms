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

  it('Should return one track', async () => {
    const response = await request(server.server).get('/tracks?ids=4MXhiYIRDMGAuvZc5IFTwC');
    expect(response.status).toEqual(HttpStatus.OK);
    expect(response.body.length).toEqual(1);
    expect(response.body[0].name).toBe('ASTROTHUNDER');
  });

  it('Should return multiple track', async () => {
    const response = await request(server.server).get(
      '/tracks?ids=4MXhiYIRDMGAuvZc5IFTwC,0gthY07uquYTZXfg1Kc5EX,4gH4e5ENzVDg4N8fOp2vDP',
    );
    expect(response.status).toEqual(HttpStatus.OK);
    expect(response.body.length).toEqual(3);
    expect(response.body[0].name).toBe('ASTROTHUNDER');
    expect(response.body[1].name).toBe('SpongeBob SquarePants Theme Song');
    expect(response.body[2].name).toBe('Ashley (with DaBaby)');
  });
});
