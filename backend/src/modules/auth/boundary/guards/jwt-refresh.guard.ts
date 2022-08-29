import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

/**
 * Graphql guard for the jwt refresh authentication.
 */
@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh-token') {
  getRequest(context: ExecutionContext) {
    return GqlExecutionContext.create(context).getContext().req;
  }
}
