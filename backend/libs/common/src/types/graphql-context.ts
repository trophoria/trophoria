import { FastifyReply, FastifyRequest } from 'fastify';

export type GraphQLContext = {
  req: FastifyRequest;
  reply: FastifyReply;
};
