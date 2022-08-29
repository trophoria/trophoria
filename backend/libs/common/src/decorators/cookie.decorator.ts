import { createParamDecorator, ExecutionContext as EC } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

/**
 * Parameter decorator which injects the request cookies into the parameter.
 */
export const Cookies = createParamDecorator((_, context: EC) => {
  return GqlExecutionContext.create(context).getContext().req.cookies;
});
