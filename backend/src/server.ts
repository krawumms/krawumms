import 'source-map-support/register';

import fastify from 'fastify';
import fastifyBlipp from 'fastify-blipp';
import fastifyCors from 'fastify-cors';
import swagger from 'fastify-swagger';
import fastifyCookie from 'fastify-cookie';
import { IncomingMessage, Server, ServerResponse } from 'http';

import SwaggerOptions from './swagger';
import spotifyApi from './spotify/api';
import partyApi from './party/api';
import userApi from './user/api';

const server: fastify.FastifyInstance<Server, IncomingMessage, ServerResponse> = fastify({
  logger: {
    prettyPrint: true,
  },
});

if (process.env.NODE_ENV !== 'production') {
  server.register(fastifyBlipp);
  server.register(swagger, SwaggerOptions);
}
server.register(fastifyCors);
server.register(fastifyCookie);
server.register(spotifyApi);
server.register(partyApi);
server.register(userApi);

export default server;
