import request from 'supertest';
import mongoose from 'mongoose';
import { CREATED } from 'http-status-codes';

import server from '../server';

describe('Test todo api', () => {
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

  it('Should create new Todo', async () => {
    const response = await request(server.server).post('/todos').send({
      text: 'test todo',
      done: false,
    });

    expect(response.status).toEqual(CREATED);
    expect(response.body).toHaveProperty('text');
    expect(response.body).toHaveProperty('done');
    expect(response.body.done).toBe(false);
  });
});
