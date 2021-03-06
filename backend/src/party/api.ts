import fastifyPlugin from 'fastify-plugin';
import HttpStatus from 'http-status-codes';
import { v4 as uuid } from 'uuid';
import secureRandomString from 'secure-random-string';

import { Party } from './model';

export const AddPartySchema = {
  description: 'Create a new party',
  tags: ['parties'],
  summary: 'Creates new party with given values',
  body: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      topic: { type: 'string' },
    },
  },
  response: {
    200: {
      description: 'Successful response',
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        topic: { type: 'string' },
      },
    },
  },
};

export default fastifyPlugin(async (server, opts, next) => {
  server.post(
    '/parties',
    {
      schema: AddPartySchema,
      preHandler: [server.auth],
    },
    async (request, reply) => {
      const { id: userId } = request.user;
      try {
        const { body } = request;
        const code = await secureRandomString({ alphanumeric: true, length: 8 });
        const party = await Party.create({
          id: uuid(),
          playlist: [],
          code,
          ownerId: userId,
          ...body,
        });

        return reply.code(HttpStatus.CREATED).send(party);
      } catch (error) {
        request.log.error(error);
        return reply.send(HttpStatus.INTERNAL_SERVER_ERROR);
      }
    },
  );

  server.get(
    '/parties',
    {
      preHandler: [server.auth],
    },
    async (request, reply) => {
      const { id: userId } = request.user;
      try {
        const parties = await Party.find({
          ownerId: userId,
        });
        reply.code(HttpStatus.OK).send(parties);
      } catch (error) {
        request.log.error(error);
        reply.send(HttpStatus.INTERNAL_SERVER_ERROR);
      }
    },
  );

  server.get('/parties/byCode/:code', async (request, reply) => {
    try {
      const {
        params: { code },
      } = request;
      const party = await Party.findOne({ code });

      if (!party) {
        reply.send(HttpStatus.NOT_FOUND);
      }

      reply.code(HttpStatus.OK).send(party);
    } catch (error) {
      request.log.error(error);
      reply.send(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  });

  server.put('/parties/:id', async (request, reply) => {
    try {
      const { body } = request;
      const {
        params: { id },
      } = request;
      const party = await Party.findOne({ id });

      if (!party) {
        reply.send(HttpStatus.NOT_FOUND);
      }

      const editedParty = await Party.findOneAndUpdate(
        { id },
        {
          ...body,
        },
        {
          new: true,
        },
      );

      reply.code(HttpStatus.OK).send(editedParty);
    } catch (error) {
      request.log.error(error);
      reply.send(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  });

  server.delete('/parties/:id', async (request, reply) => {
    try {
      const {
        params: { id },
      } = request;
      const { deletedCount } = await Party.deleteOne({ id });

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

  server.put(
    '/parties/:id/playlist',
    {
      preHandler: [server.client],
    },
    async (request, reply) => {
      const { clientUuid } = request;
      try {
        const { body } = request;
        const {
          params: { id },
        } = request;
        const party = await Party.findOne({ id });

        if (!party) {
          reply.send(HttpStatus.NOT_FOUND);
        }

        const track = { ...body, votes: [clientUuid] };

        const editedParty = await Party.findOneAndUpdate(
          { id },
          {
            $push: {
              playlist: track,
            },
          },
          {
            new: true,
          },
        );

        reply.code(HttpStatus.OK).send(editedParty);
      } catch (error) {
        request.log.error(error);
        reply.send(HttpStatus.INTERNAL_SERVER_ERROR);
      }
    },
  );

  server.put(
    '/parties/:id/playlist/:trackId/up-vote',
    {
      preHandler: [server.client],
    },
    async (request, reply) => {
      const { clientUuid } = request;

      try {
        const {
          params: { id, trackId },
        } = request;
        const party = await Party.findOne({ id });

        if (!party) {
          reply.send(HttpStatus.NOT_FOUND);
        }

        const editedParty = await Party.findOneAndUpdate(
          { id, 'playlist.id': trackId },
          {
            $push: {
              'playlist.$.votes': clientUuid,
            },
          },
          {
            new: true,
          },
        );

        reply.code(HttpStatus.OK).send(editedParty);
      } catch (error) {
        request.log.error(error);
        reply.send(HttpStatus.INTERNAL_SERVER_ERROR);
      }
    },
  );

  server.put(
    '/parties/:id/playlist/:trackId/down-vote',
    {
      preHandler: [server.client],
    },
    async (request, reply) => {
      const { clientUuid } = request;
      try {
        const {
          params: { id, trackId },
        } = request;
        const party = await Party.findOne({ id });

        if (!party) {
          reply.send(HttpStatus.NOT_FOUND);
        }

        const editedParty = await Party.findOneAndUpdate(
          { id, 'playlist.id': trackId },
          {
            $pull: {
              'playlist.$.votes': clientUuid,
            },
          },
          {
            new: true,
          },
        );

        reply.code(HttpStatus.OK).send(editedParty);
      } catch (error) {
        request.log.error(error);
        reply.send(HttpStatus.INTERNAL_SERVER_ERROR);
      }
    },
  );

  server.delete('/parties/:id/playlist', async (request, reply) => {
    try {
      const {
        params: { id },
        body,
      } = request;
      const party = await Party.findOne({ id });

      if (!party) {
        reply.send(HttpStatus.NOT_FOUND);
      }

      const track = JSON.parse(body);

      const editedParty = await Party.findOneAndUpdate(
        { id },
        {
          $pull: {
            playlist: track,
          },
        },
        {
          new: true,
        },
      );

      reply.code(HttpStatus.OK).send(editedParty.playlist);
    } catch (error) {
      request.log.error(error);
      reply.send(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  });

  server.get('/parties/:id/playlist', async (request, reply) => {
    try {
      const {
        params: { id },
      } = request;
      const party = await Party.findOne({ id });

      if (!party) {
        reply.send(HttpStatus.NOT_FOUND);
      }
      reply.code(HttpStatus.OK).send(party.playlist);
    } catch (error) {
      request.log.error(error);
      reply.send(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  });

  server.get('/parties/:id', async (request, reply) => {
    try {
      const {
        params: { id },
      } = request;
      const party = await Party.findOne({ id });

      if (!party) {
        reply.send(HttpStatus.NOT_FOUND);
      }

      reply.code(HttpStatus.OK).send(party);
    } catch (error) {
      request.log.error(error);
      reply.send(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  });

  next();
});
