import request from 'supertest';
import mongoose from 'mongoose';
import { CREATED } from 'http-status-codes';

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
});
