import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

/**
 * Graphql guard for the local authentication. This guard adds the
 * object values of name `credentials` to the request body, so that
 * it can get parsed by passport. Make sure to name the graphql
 * query variable to `credentials` for email and password input
 * when using this guard.
 */
@Injectable()
export class LocalAuthenticationGuard extends AuthGuard('local') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;
    req.body = ctx.getArgs().credentials;
    return req;
  }
}
