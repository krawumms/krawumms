import fastifyPlugin from 'fastify-plugin';
import HttpStatus from 'http-status-codes';
import { v4 as uuid } from 'uuid';
import SpotifyWebApi from 'spotify-web-api-node';
import { User } from '../user/model';
import config from '../config';

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
      const response = await spotifyApi.getMe();
      const { body } = response;
      const { id } = response.body;
      const user = await User.findOne({ id });
      if (!user) {
        await User.create({
          id: uuid(),
          ...body,
        });
      }
      response.body.access_token = accessToken;
      response.body.refresh_token = refreshToken;
      reply.status(HttpStatus.OK).send(response.body);
    } catch (error) {
      request.log.error(error);
      reply.send(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  });
  next();
});
