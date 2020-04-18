import { ServerResponse } from 'http';
import { FastifyReply, FastifyRequest } from 'fastify';
import app from './server';

export default async function serverless(req: FastifyRequest, res: FastifyReply<ServerResponse>) {
  await app.ready();

  app.server.emit('request', req, res);
}
