import request from 'supertest';
import mongoose from 'mongoose';
import { CREATED, OK } from 'http-status-codes';

import server from '../server';

describe('Test User api', () => {
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

  it('Should create new User', async () => {
    const response = await request(server.server).post('/user').send({
      id: '1',
      email: 'Test',
      display_name: 'TESTDISPLAY',
    });
    expect(response.status).toEqual(CREATED);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('email');
    expect(response.body).toHaveProperty('display_name');
    expect(response.body.id).toBe('1');
    expect(response.body.email).toBe('Test');
    expect(response.body.display_name).toBe('TESTDISPLAY');
  });
  it('Should find a User', async () => {
    const response = await request(server.server).get('/user/1');
    expect(response.status).toEqual(OK);
    expect(response.body).toHaveProperty('email');
    expect(response.body).toHaveProperty('display_name');
    expect(response.body.email).toBe('Test');
    expect(response.body.display_name).toBe('TESTDISPLAY');
  });
  it('Should delete a User', async () => {
    const response = await request(server.server).delete('/user/1');
    expect(response.status).toEqual(OK);
  });
});
