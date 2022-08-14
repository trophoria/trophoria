import { Module } from '@nestjs/common';

import { UserResolver } from '@trophoria/modules/user/boundary/user.resolver';
import { UserService } from '@trophoria/modules/user/business/user.service';

@Module({
  providers: [UserService, UserResolver],
  exports: [UserService],
})
export class UserModule {}
