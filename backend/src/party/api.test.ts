import request from 'supertest';
import mongoose from 'mongoose';
import { OK, CREATED, NOT_FOUND } from 'http-status-codes';

import server from '../server';

const bearer =
  'Bearer BQC4lQOBT-eQ9ZnECslf5lBGL-7S8P4xDdea03IURwueBRm2cUfxObyFbWNC0y0Ffqzh7qsrHiNhOcZ_Za8BaMnOfHfUP40I4O6gfsaJoc8kIAMc2S9bFNDLg_7jgqubmrL7yD5SAWT0Fx7ZzsQLIGDeW5YY5o6NuGsbww';

describe('Test party api', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await server.ready();
  });

  beforeEach(async () => {
    await request(server.server).post('/parties').set('Authorization', bearer).send({
      id: '1',
      name: 'first test party',
    });
    await request(server.server).post('/parties').set('Authorization', bearer).send({
      id: '2',
      name: 'second test party',
    });
    await request(server.server).post('/parties').set('Authorization', bearer).send({
      id: '4',
      name: 'fourth test party',
    });
    await request(server.server).put('/parties/1/playlist').set('x-krawumms-client', '1234').send({
      id: 'song1',
    });
    await request(server.server).put('/parties/4/playlist').set('x-krawumms-client', '12').send({
      id: 'song4',
    });
  });

  afterAll(() => {
    mongoose.disconnect();
    server.close();
  });

  it('Should create new Party', async () => {
    const response = await request(server.server).post('/parties').set('Authorization', bearer).send({
      id: '3',
      name: 'third test party',
    });
    expect(response.status).toEqual(CREATED);
    expect(response.body.id).toBe('3');
  });

  it('Should create new Party', async () => {
    const response = await request(server.server).post('/parties').set('Authorization', bearer).send({
      id: '3',
      name: 'third test party',
    });
    expect(response.status).toEqual(CREATED);
    expect(response.body.id).toBe('3');
  });

  it('Should return all Parties', async () => {
    const response = await request(server.server).get('/parties').set('Authorization', bearer).send();
    expect(response.status).toEqual(OK);
    expect(response.body[0].id).toBe('1');
    expect(response.body[1].id).toBe('2');
    console.log(response.body);
  });

  it('Should return a party by code', async () => {
    const partyResponse = await request(server.server).get('/parties').set('Authorization', bearer).send();
    const coderesponse = await request(server.server).get(`/parties/byCode/${partyResponse.body[0].code}`).send();
    expect(coderesponse.status).toEqual(OK);
    expect(coderesponse.body.id).toBe('1');
  });

  it('Should return NOT_FOUND for invalid Code', async () => {
    const response = await request(server.server).get(`/parties/byCode/dfasdas123gd`).send();
    expect(response.body).toEqual(NOT_FOUND);
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
    const response = await request(server.server).put('/parties/2/playlist').set('x-krawumms-client', '1234').send({
      id: 'test',
    });
    expect(response.status).toEqual(OK);
    expect(response.body.playlist.length).toEqual(1);
  });

  it('Should get songs from playlist', async () => {
    const response = await request(server.server).get('/parties/2/playlist');
    console.log(response.body);
    expect(response.body.length).toEqual(1);
    expect(response.status).toEqual(OK);
  });

  it('Should delete song from playlist', async () => {
    const response = await request(server.server)
      .delete('/parties/1/playlist')
      .send({
        body: {
          id: 'Test',
        },
      });
    expect(response.status).toEqual(OK);
  });

  it('Should return 404 for invalid ID in PUT', async () => {
    const response = await request(server.server).put('/parties/1111').set('Authorization', 'Bearer abcd').send();
    expect(response.status).toEqual(OK);
    expect(response.body).toEqual(404);
  });

  it('Should make an upvote on a track', async () => {
    const response = await request(server.server)
      .put('/parties/1/playlist/song1/up-vote')
      .set('x-krawumms-client', '123456')
      .send({
        body: {
          id: '1',
          trackId: 'song1',
        },
      });
    expect(response.body.playlist[0].votes).toEqual(['1234', '123456']);
    expect(response.status).toEqual(OK);
  });

  it('Should make an downvote on a track', async () => {
    const response = await request(server.server)
      .put('/parties/4/playlist/song4/down-vote')
      .set('x-krawumms-client', '12')
      .send({
        body: {
          id: '4',
          trackId: 'song4',
        },
      });
    expect(response.body.playlist[0].votes).toEqual([]);
    expect(response.status).toEqual(OK);
  });
});
