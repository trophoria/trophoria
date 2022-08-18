import { Module } from '@nestjs/common';

import { UserService } from '@trophoria/modules/user/business/user.service';

/**
 * This module exports helper functions to find, create, update users and
 * utilities to handle active refresh tokens.
 */
@Module({ providers: [UserService], exports: [UserService] })
export class UserModule {}
