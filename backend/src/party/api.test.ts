import request from 'supertest';
import mongoose from 'mongoose';
import { OK } from 'http-status-codes';
import { Party } from './model';

import server from '../server';

describe('Test party api', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await server.ready();
    await Party.create({
      id: '1',
      name: 'test party',
    });
  });

  afterAll(() => {
    mongoose.disconnect();
    server.close();
  });

  // xdescribe('Should create new Party', async () => {
  //   const response = await request(server.server).post('/parties').set('Authorization', 'Bearer abcd').send({
  //     id: '1',
  //     name: 'test party',
  //   });
  //   expect(response.status).toEqual(CREATED);
  //   expect(response.body).toHaveProperty('name');
  // });
  // xdescribe('Should return all Parties', async () => {
  //   const response = await request(server.server).get('/parties').set('Authorization', 'Bearer abcd').send();
  //   expect(response.status).toEqual(OK);
  //   expect(response.body.length).toBeGreaterThan(0);
  // });

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
    const response = await request(server.server).put('/parties/1/playlist').set('x-krawumms-client', '1234').send({
      id: 'test',
    });
    expect(response.status).toEqual(OK);
    expect(response.body.playlist.length).toEqual(1);
  });

  it('Should get songs from playlist', async () => {
    const response = await request(server.server).get('/parties/1/playlist');
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
});
