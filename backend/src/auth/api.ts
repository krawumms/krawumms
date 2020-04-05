import fastifyPlugin from 'fastify-plugin';
import HttpStatus from 'http-status-codes';
import { v4 as uuid } from 'uuid';
import SpotifyWebApi from 'spotify-web-api-node';
import config from '../config';

const axios = require('axios').default;

const spotifyApi = new SpotifyWebApi({
  clientId: config.spotify.clientId,
  clientSecret: config.spotify.clientSecret,
  redirectUri: config.spotify.redirectUri,
});

const stateKey = 'spotify_auth_state';

export default fastifyPlugin(async (server, opts, next) => {
  server.get('/login', async (request, reply) => {
    const scopes = ['user-read-private', 'user-read-email'];
    const state = uuid();
    reply.setCookie(stateKey, state);
    reply.redirect(spotifyApi.createAuthorizeURL(scopes, state));
  });

  server.get('/callback', async (request, reply) => {
    try {
      const code = request.query.code || null;
      const state = request.query.state || null;
      const storedState = request.cookies ? request.cookies[stateKey] : null;

      if (state === null || state !== storedState) {
        reply.send('state_mismatch');
      }

      reply.clearCookie(stateKey);

      const response = await spotifyApi.authorizationCodeGrant(code);

      // temporary, no idea if this is best practice
      spotifyApi.setAccessToken(response.body.access_token);
      spotifyApi.setRefreshToken(response.body.refresh_token);

      reply.redirect('http://localhost:3000/profile');
    } catch (error) {
      request.log.error(error);
      reply.send(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  });

  server.get('/refresh_token', async (request, reply) => {
    try {
      // we can directly do this as the access and refresh token have been set previously (in /callback)
      const response = await spotifyApi.refreshAccessToken();
      spotifyApi.setAccessToken(response.body.access_token);

      reply.redirect('http://localhost:3000/profile');
    } catch (error) {
      request.log.error(error);
      reply.send(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  });

  server.get('/profile', async (request, reply) => {
    try {
      const accessToken = spotifyApi.getAccessToken();
      const refreshToken = spotifyApi.getRefreshToken();
      const spotifyResponse = await spotifyApi.getMe();
      const { id } = spotifyResponse.body;
      const userApiResponse = await axios.get(`http://localhost:6011/user/${id}`);
      if (userApiResponse.data === HttpStatus.NOT_FOUND) {
        await axios.post('http://localhost:6011/user', spotifyResponse.body);
      }
      spotifyResponse.body.access_token = accessToken;
      spotifyResponse.body.refresh_token = refreshToken;
      reply.status(HttpStatus.OK).send(spotifyResponse.body);
    } catch (error) {
      request.log.error(error);
      reply.send(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  });
  next();
});
