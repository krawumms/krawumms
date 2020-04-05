import fastifyPlugin from 'fastify-plugin';
import HttpStatus from 'http-status-codes';
import fetch from 'isomorphic-unfetch';

// temporary till token handling has been implemented properly
const accessToken =
  'BQB7uUtMAdlaCt9fhIH5XkJL5fSzwXw0bDeF5Fpufv0sCNNRz1a_9PO9NEJV8dFF9I5ElJgNXd-uY168HXYOfTjE9PWMIcsK2jwEcy_GevnvgcXgKCsVwI0eWmqjSu2YvFR_B-JM755ihdCr2bhINilO-eTydUUhwYeRb2cK';

const SPOTIFY_API_BASE_URL = 'https://api.spotify.com';

export default fastifyPlugin(async (server, opts, next) => {
  server.get('/search', async (request, reply) => {
    try {
      const { query, limit, offset } = request.query;

      const response = await fetch(
        `${SPOTIFY_API_BASE_URL}/v1/search?q=${query}&type=track&market=from_token&limit=${limit}&offset=${offset}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const res = await response.json();

      reply.status(HttpStatus.OK).send(res.tracks.items);
    } catch (error) {
      request.log.error(error);
      reply.send(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  });

  next();
});
