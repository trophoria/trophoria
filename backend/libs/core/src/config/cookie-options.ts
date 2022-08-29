import { CookieSerializeOptions } from '@fastify/cookie';

export const secureCookieOptions: CookieSerializeOptions = {
  httpOnly: true,
  sameSite: 'strict',
  secure: true,
  maxAge: 60 * 60 * 24 * 30,
};
