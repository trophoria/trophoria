import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from '@trophoria/modules/auth/auth.module';

import { GoogleAuthController } from '@trophoria/modules/auth/modules/googleAuth/boundary/google-auth.controller';
import { GoogleAuthStrategy } from '@trophoria/modules/auth/modules/googleAuth/business/strategies/google.strategy';
import { UserModule } from '@trophoria/modules/user/user.module';

@Module({
  imports: [UserModule, forwardRef(() => AuthModule)],
  controllers: [GoogleAuthController],
  providers: [GoogleAuthStrategy],
})
export class GoogleAuthModule {}
