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

  it('Should return 404 for invalid ID in PUT', async () => {
    const response = await request(server.server).put('/parties/1111').send();

    expect(response.status).toEqual(OK);
    expect(response.body).toEqual(404);
  });
});
