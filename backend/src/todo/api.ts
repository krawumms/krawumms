import fastifyPlugin from 'fastify-plugin';
import HttpStatus from 'http-status-codes';
import { v4 as uuid } from 'uuid';

import { Todo } from './model';

export const AddTodoSchema = {
  description: 'Create a new todo',
  tags: ['todos'],
  summary: 'Creates new todo with given values',
  body: {
    type: 'object',
    properties: {
      text: { type: 'string' },
      done: { type: 'boolean' },
    },
  },
  response: {
    200: {
      description: 'Successful response',
      type: 'object',
      properties: {
        id: { type: 'string' },
        text: { type: 'string' },
        done: { type: 'boolean' },
      },
    },
  },
};

export default fastifyPlugin(async (server, opts, next) => {
  server.post('/todos', { schema: AddTodoSchema }, async (request, reply) => {
    try {
      const { body } = request;
      const todo = await Todo.create({
        id: uuid(),
        ...body,
      });

      return reply.code(HttpStatus.CREATED).send(todo);
    } catch (error) {
      request.log.error(error);
      return reply.send(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  });

  server.get('/todos', async (request, reply) => {
    try {
      const todos = await Todo.find();
      reply.code(HttpStatus.OK).send(todos);
    } catch (error) {
      request.log.error(error);
      reply.send(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  });

  server.get('/todos/:id', async (request, reply) => {
    try {
      const {
        params: { id },
      } = request;
      const todo = await Todo.findOne({ id });

      if (!todo) {
        reply.send(HttpStatus.NOT_FOUND);
      }

      reply.code(HttpStatus.OK).send(todo);
    } catch (error) {
      request.log.error(error);
      reply.send(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  });

  server.delete('/todos/:id', async (request, reply) => {
    try {
      const {
        params: { id },
      } = request;
      const { deletedCount } = await Todo.deleteOne({ id });

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
