import fastifyPlugin from 'fastify-plugin';
import HttpStatus from 'http-status-codes';
import fetch from 'node-fetch';
import spotifyApi from '../utils/spotify';

const SPOTIFY_API_BASE_URL = 'https://api.spotify.com';

export default fastifyPlugin(async (server, opts, next) => {
  server.get('/search', async (request, reply) => {
    try {
      const { query, limit, offset } = request.query;

      const { body: token } = await spotifyApi.clientCredentialsGrant();

      spotifyApi.setAccessToken(token.access_token);

      const { body } = await spotifyApi.searchTracks(query, { limit, offset });

      reply.status(HttpStatus.OK).send(body.tracks.items);
    } catch (error) {
      request.log.error(error);
      reply.send(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  });

  next();
});
