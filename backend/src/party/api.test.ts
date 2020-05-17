import request from 'supertest';
import mongoose from 'mongoose';
import { OK, CREATED, NOT_FOUND } from 'http-status-codes';
import SpotifyWebApi from 'spotify-web-api-node';
import server from '../server';
import config from '../config';

const spotifyApi = new SpotifyWebApi({
  clientId: config.spotify.clientId,
  clientSecret: config.spotify.clientSecret,
  redirectUri: config.spotify.redirectUri,
});
let bearer = '';
describe('Test party api', () => {
  beforeAll(async () => {
    spotifyApi.setRefreshToken(
      'AQCPlJAhNnwZojV3y5VXuPAZ9PkVtqN8pP5DHpZwACVLtppMDsHUQLdh00YSfmUQcXf04hv3584Zx1zZfa4O6piVotbktwFQn_39N7Usz7X6wnnChv3tuQqLuWiw2STgJw8',
    );
    spotifyApi.refreshAccessToken().then(
      function (data) {
        console.log('The access token has been refreshed!');

        // Save the access token so that it's used in future calls
        bearer = `Bearer ${data.body.access_token}`;
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
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    mongoose.connection.db.dropCollection('party', function () {});
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

  it('Should return all Parties', async () => {
    const response = await request(server.server).get('/parties').set('Authorization', bearer).send();
    expect(response.status).toEqual(OK);
    console.log(response.body);
    expect(response.body.length).toBe(3);
  });

  it('Should return a party by code', async () => {
    const partyResponse = await request(server.server).get('/parties').set('Authorization', bearer).send();
    const coderesponse = await request(server.server).get(`/parties/byCode/${partyResponse.body[0].code}`).send();
    expect(coderesponse.status).toEqual(OK);
    expect(coderesponse.body.id).toBe('1');
  });

  it('Should return NOT_FOUND for invalid Code', async () => {
    const response = await request(server.server).get(`/parties/byCode/dfasdas123gd`).send();
    expect(response.status).toEqual(OK);
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
    const response = await request(server.server).get('/parties/4/playlist');
    expect(response.status).toEqual(OK);
    expect(response.body.length).toEqual(1);
  });

  it('Should delete song from playlist', async () => {
    const response = await request(server.server)
      .delete('/parties/1/playlist')
      .send({
        body: {
          id: 'song1',
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
    expect(response.status).toEqual(OK);
    expect(response.body.playlist[0].votes).toEqual(['1234', '123456']);
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
    expect(response.status).toEqual(OK);
    expect(response.body.playlist[0].votes).toEqual([]);
  });
});
