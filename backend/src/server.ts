import 'source-map-support/register';

import fastify from 'fastify';
import fastifyBlipp from 'fastify-blipp';
import fastifyCors from 'fastify-cors';
import swagger from 'fastify-swagger';
import fastifyCookie from 'fastify-cookie';
import { IncomingMessage, Server, ServerResponse } from 'http';
import HttpStatus from 'http-status-codes';
import { parse } from 'auth-header';

import SwaggerOptions from './swagger';
import spotifyApi from './spotify/api';
import partyApi from './party/api';
import userApi from './user/api';
import { createUserSpotifyApi } from './utils/spotify';

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

server.decorate('auth', async (request, reply) => {
  const authHeader = request.headers && request.headers.authorization;
  if (!authHeader) {
    reply.code(HttpStatus.UNAUTHORIZED).send();
  } else {
    const auth = parse(authHeader);
    if (auth.scheme !== 'Bearer') {
      reply.code(HttpStatus.UNAUTHORIZED).send();
    } else {
      const { token } = auth;
      const api = await createUserSpotifyApi(token);
      try {
        const { body } = await api.getMe();
        request.user = body;
      } catch (e) {
        request.log.error(e);
        reply.code(e.statusCode).send();
      }
    }
  }
});

server.decorate('client', async (request, reply) => {
  const clientHeader = request.headers && request.headers['x-krawumms-client'];
  if (!clientHeader) {
    reply.code(HttpStatus.UNPROCESSABLE_ENTITY).send();
  } else {
    request.clientUuid = clientHeader;
  }
});

export default server;
