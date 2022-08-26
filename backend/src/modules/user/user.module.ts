import { Module } from '@nestjs/common';

import { UserDatabaseService } from '@trophoria/modules/user/business/user.database.service';

/**
 * This module exports helper functions to find, create, update users and
 * utilities to handle active refresh tokens.
 */
@Module({ providers: [UserDatabaseService], exports: [UserDatabaseService] })
export class UserModule {}

//* Global module exports */
export * from './business/user.database.service';
export * from './business/user.service';
