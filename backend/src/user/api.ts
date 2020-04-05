import fastifyPlugin from 'fastify-plugin';
import HttpStatus from 'http-status-codes';
import { v4 as uuid } from 'uuid';
import { User } from './model';

export const AddUserSchema = {
  description: 'Create a new User',
  tags: ['users'],
  summary: 'Creates new user with given values',
  body: {
    type: 'object',
    properties: {
      display_name: { type: 'string' },
      email: { type: 'string' },
    },
  },
  response: {
    200: {
      description: 'Successful response',
      type: 'object',
      properties: {
        id: { type: 'string' },
        display_name: { type: 'string' },
        email: { type: 'string' },
      },
    },
  },
};

export default fastifyPlugin(async (server, opts, next) => {
  server.post('/user', { schema: AddUserSchema }, async (request, reply) => {
    try {
      const { body } = await request;
      const user = await User.create({
        id: uuid(),
        ...body,
      });

      return reply.code(HttpStatus.CREATED).send(user);
    } catch (error) {
      request.log.error(error);
      return reply.send(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  });

  server.get('/user/:id', async (request, reply) => {
    try {
      const {
        params: { id },
      } = request;
      const user = await User.findOne({ id });

      if (!user) {
        reply.send(HttpStatus.NOT_FOUND);
      }
      reply.code(HttpStatus.OK).send(user);
    } catch (error) {
      request.log.error(error);
      reply.send(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  });

  server.delete('/user/:id', async (request, reply) => {
    try {
      const {
        params: { id },
      } = request;
      const { deletedCount } = await User.deleteOne({ id });

      if (deletedCount) {
        reply.send(HttpStatus.OK);
      } else {
        reply.send(HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      request.log.error(error);
      reply.send(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  });
  next();
});
