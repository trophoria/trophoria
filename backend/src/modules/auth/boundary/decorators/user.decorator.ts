import { createParamDecorator, ExecutionContext as EC } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

/**
 * Parameter decorator which injects the user object of the request
 * into the parameter. THIS IS USED FOR GRAPHQL ENDPOINTS.
 */
export const CurrentUser = createParamDecorator((_, context: EC) => {
  return GqlExecutionContext.create(context).getContext().req.user;
});

/**
 * Parameter decorator which injects the user object of the request
 * into the parameter. THIS IS USED FOR REST ENDPOINTS.
 */
export const CurrentRestUser = createParamDecorator((_, context: EC) => {
  return context.switchToHttp().getRequest().user;
});
