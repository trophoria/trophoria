import { DoneFuncWithErrOrRes, FastifyReply, FastifyRequest } from 'fastify';

export const fastifyExpressCompatibleHook = (
  request: FastifyRequest,
  reply: FastifyReply,
  done: DoneFuncWithErrOrRes,
) => {
  reply['setHeader'] = function (key: string, value: string) {
    return this.raw.setHeader(key, value);
  };

  reply['end'] = function () {
    this.raw.end();
  };

  request['res'] = reply;

  done();
};
