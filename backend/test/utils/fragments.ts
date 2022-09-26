import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { User } from '@trophoria/graphql/user/user.model';

import {
  signInQuery,
  signUpQuery,
} from '@trophoria/test/e2e/auth/auth.queries';
import { gqlData, graphql } from '@trophoria/test/utils/e2e-utils';

export const signUp = async (
  app: NestFastifyApplication,
  userInput: { email: string; password: string },
): Promise<User> => {
  return gqlData(await graphql(app, signUpQuery, { userInput }), 'signUp');
};

export const signIn = async (
  app: NestFastifyApplication,
  credentials: { email: string; password: string },
) => {
  return gqlData(await graphql(app, signInQuery, { credentials }), 'signIn')
    .accessToken;
};

export const authenticate = async (
  app: NestFastifyApplication,
  userInput: { email: string; password: string },
) => {
  const user = await signUp(app, userInput);
  const accessToken = await signIn(app, userInput);
  return { user, accessToken };
};
