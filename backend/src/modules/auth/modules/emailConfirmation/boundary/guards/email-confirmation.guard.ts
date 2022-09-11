import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

/** Guard to protect routes against not verified users. */
@Injectable()
export class EmailConfirmedGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const req = GqlExecutionContext.create(context).getContext().req;

    if (!req.user?.isEmailConfirmed) {
      throw new HttpException(
        'please confirm your email first',
        HttpStatus.BAD_REQUEST,
      );
    }

    return true;
  }
}
