import fastifyPlugin from 'fastify-plugin';
import HttpStatus from 'http-status-codes';
import createSpotifyApi from '../utils/spotify';


export default fastifyPlugin(async (server, opts, next) => {
  server.get('/search', async (request, reply) => {
    try {
      const { query, limit, offset } = request.query;

      const spotifyApi = await createSpotifyApi();

      const { body } = await spotifyApi.searchTracks(query, { limit, offset });

      reply.status(HttpStatus.OK).send(body.tracks.items);
    } catch (error) {
      request.log.error(error);
      reply.send(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  });

  next();
});

