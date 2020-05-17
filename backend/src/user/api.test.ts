import request from 'supertest';
import mongoose from 'mongoose';
import { CREATED, NOT_FOUND, OK } from 'http-status-codes';
import SpotifyWebApi from 'spotify-web-api-node';
import server from '../server';
import config from '../config';

const spotifyApi = new SpotifyWebApi({
  clientId: config.spotify.clientId,
  clientSecret: config.spotify.clientSecret,
  redirectUri: config.spotify.redirectUri,
});

let bearer = '';
describe('Test User api', () => {
  beforeAll(async () => {
    spotifyApi.setRefreshToken(
      'AQCPlJAhNnwZojV3y5VXuPAZ9PkVtqN8pP5DHpZwACVLtppMDsHUQLdh00YSfmUQcXf04hv3584Zx1zZfa4O6piVotbktwFQn_39N7Usz7X6wnnChv3tuQqLuWiw2STgJw8',
    );
    spotifyApi.refreshAccessToken().then(
      function (data) {
        console.log('The access token has been refreshed!');

        // Save the access token so that it's used in future calls
        // eslint-disable-next-line prettier/prettier
        bearer = `Bearer ${ data.body.access_token}`;
      },
      function (err) {
        console.log('Could not refresh access token', err);
      },
    );
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
    expect(response.status).toEqual(OK);
    expect(response.body).toEqual(NOT_FOUND);
  });

  it('Should delete a User', async () => {
    const response = await request(server.server).delete('/user/20');
    expect(response.status).toEqual(OK);
  });

  it('Should not find user to delete', async () => {
    const response = await request(server.server).delete('/user/30');
    expect(response.status).toEqual(OK);
    expect(response.body).toEqual(NOT_FOUND);
  });
});
