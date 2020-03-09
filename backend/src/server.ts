import 'source-map-support/register';

import fastify from 'fastify';
import fastifyBlipp from 'fastify-blipp';
import fastifyCors from 'fastify-cors';
import swagger from 'fastify-swagger';
import { IncomingMessage, Server, ServerResponse } from 'http';

import SwaggerOptions from './swagger';
import todoApi from './todo/api';

const server: fastify.FastifyInstance<Server, IncomingMessage, ServerResponse> = fastify({
  logger: {
    prettyPrint: true,
  },
});

if (process.env.NODE_ENV !== 'production') {
  server.register(fastifyBlipp);
  server.register(swagger, SwaggerOptions);
  server.register(fastifyCors);
}

server.register(todoApi);

export default server;
