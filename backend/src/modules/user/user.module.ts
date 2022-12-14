import { forwardRef, Module } from '@nestjs/common';
import { EmailConfirmationModule } from '@trophoria/modules/auth/modules/emailConfirmation/email-confirmation.module';
import { FileModule } from '@trophoria/modules/file/file.module';
import { UserController } from '@trophoria/modules/user/boundary/user.controller';
import { UserResolver } from '@trophoria/modules/user/boundary/user.resolver';

import { UserDatabaseService } from '@trophoria/modules/user/business/user-database.service';
import { UserServiceSymbol } from '@trophoria/modules/user/business/user.service';

/**
 * This module exports helper functions to find, create, update users and
 * utilities to handle active refresh tokens.
 */
@Module({
  imports: [FileModule, forwardRef(() => EmailConfirmationModule)],
  providers: [
    { provide: UserServiceSymbol, useClass: UserDatabaseService },
    UserResolver,
  ],
  exports: [UserServiceSymbol],
  controllers: [UserController],
})
export class UserModule {}
