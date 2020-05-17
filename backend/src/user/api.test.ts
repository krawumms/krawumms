import request from 'supertest';
import mongoose from 'mongoose';
import {CREATED, NOT_FOUND, OK} from 'http-status-codes';

import server from '../server';

const bearer =
  'Bearer BQC4lQOBT-eQ9ZnECslf5lBGL-7S8P4xDdea03IURwueBRm2cUfxObyFbWNC0y0Ffqzh7qsrHiNhOcZ_Za8BaMnOfHfUP40I4O6gfsaJoc8kIAMc2S9bFNDLg_7jgqubmrL7yD5SAWT0Fx7ZzsQLIGDeW5YY5o6NuGsbww';
describe('Test User api', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await server.ready();
  });

  beforeEach(async () => {
    await request(server.server).post('/user').send({
      id: '20',
      email: 'test@email.com',
      display_name: 'DisplayTest',
    });
  });

  afterAll(() => {
    mongoose.disconnect();
    server.close();
  });

  it('Should get Spotify User data', async () => {
    const response = await request(server.server).get('/me').set('Authorization', bearer).send();
    expect(response.status).toEqual(OK);
    expect(response.body.product).toBe('premium');
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
    const response = await request(server.server).get('/user/20');
    expect(response.status).toEqual(OK);
    expect(response.body).toHaveProperty('email');
    expect(response.body).toHaveProperty('display_name');
    expect(response.body.email).toBe('test@email.com');
    expect(response.body.display_name).toBe('DisplayTest');
  });

  it('Should return user NOT_FOUND', async () => {
    const response = await request(server.server).get('/user/999999');
    expect(response.body).toEqual(NOT_FOUND);
  });

  it('Should delete a User', async () => {
    const response = await request(server.server).delete('/user/20');
    expect(response.status).toEqual(OK);
  });

  it('Should not find user to delete', async () => {
    const response = await request(server.server).delete('/user/30');
    expect(response.body).toEqual(NOT_FOUND);
    expect(response.status).toEqual(OK);
  });
});
