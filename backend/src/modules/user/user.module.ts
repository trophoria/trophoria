import { Module } from '@nestjs/common';

import { UserDatabaseService } from '@trophoria/modules/user/business/user-database.service';
import { UserServiceSymbol } from '@trophoria/modules/user/business/user.service';

/**
 * This module exports helper functions to find, create, update users and
 * utilities to handle active refresh tokens.
 */
@Module({
  providers: [{ provide: UserServiceSymbol, useClass: UserDatabaseService }],
  exports: [UserServiceSymbol],
})
export class UserModule {}
