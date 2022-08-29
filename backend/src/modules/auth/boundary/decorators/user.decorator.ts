import { createParamDecorator, ExecutionContext as EC } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

/**
 * Parameter decorator which injects the user object of the request
 * into the parameter.
 */
export const CurrentUser = createParamDecorator((_, context: EC) => {
  return GqlExecutionContext.create(context).getContext().req.user;
});
