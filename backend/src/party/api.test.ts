import request from 'supertest';
import mongoose from 'mongoose';
import { CREATED, OK } from 'http-status-codes';

import server from '../server';

describe('Test party api', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await server.ready();
  });

  afterAll(() => {
    mongoose.disconnect();
    server.close();
  });

  it('Should create new Party', async () => {
    const response = await request(server.server).post('/parties').send({
      id: '1',
      name: 'test party',
    });

    expect(response.status).toEqual(CREATED);
    expect(response.body).toHaveProperty('name');
  });

  it('Should return all Parties', async () => {
    const response = await request(server.server).get('/parties').send();

    expect(response.status).toEqual(OK);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('Should return 404 for invalid ID in GET', async () => {
    const response = await request(server.server).get('/parties/1111').send();

    expect(response.status).toEqual(OK);
    expect(response.body).toEqual(404);
  });

  it('Should return 404 for invalid ID in DELETE', async () => {
    const response = await request(server.server).delete('/parties/1111').send();

    expect(response.status).toEqual(OK);
    expect(response.body).toEqual(404);
  });

  it('Should add song to playlist', async () => {
    const response = await request(server.server)
      .put('/parties/1/playlist')
      .send({
        playlist: ['Test', 'Test1'],
      });
    expect(response.status).toEqual(OK);
    expect(response.body.length).toEqual(1);
    expect(response.body[0].playlist.length).toEqual(2);
    expect(response.body[0].playlist[0]).toBe('Test');
  });

  it('Should get songs from playlist', async () => {
    const response = await request(server.server).get('/parties/1/playlist');
    expect(response.body[0].playlist).toStrictEqual(['Test', 'Test1']);
    expect(response.body[0].playlist.length).toEqual(2);
    expect(response.status).toEqual(OK);
  });

  it('Should delete song from playlist', async () => {
    const response = await request(server.server).delete('/parties/1/playlist').send({
      body: 'Test',
    });
    expect(response.status).toEqual(OK);
  });
});
