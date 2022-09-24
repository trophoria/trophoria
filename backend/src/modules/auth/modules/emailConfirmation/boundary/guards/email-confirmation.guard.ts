// TODO: REMOVE IF EMAIL CONFIRMATION GUARD IS USED
/* istanbul ignore file */

import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { User } from '@trophoria/graphql/user/user.model';

/** Guard to protect routes against not verified users. */
@Injectable()
export class EmailConfirmedGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const req = GqlExecutionContext.create(context).getContext().req;
    const user = req.user as User;

    if (!user || !user.isVerified) {
      throw new HttpException(
        'please confirm your email first',
        HttpStatus.BAD_REQUEST,
      );
    }

    return true;
  }
}
