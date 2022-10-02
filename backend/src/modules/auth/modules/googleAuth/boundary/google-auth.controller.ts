import {
  Controller,
  Get,
  HttpStatus,
  Inject,
  Res,
  UseGuards,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';

import { User } from '@trophoria/graphql/user/user.model';
import { ApiConfigService } from '@trophoria/modules/_setup/config/api-config.service';
import { CurrentRestUser } from '@trophoria/modules/auth/boundary/decorators/user.decorator';
import {
  AuthService,
  AuthServiceSymbol,
} from '@trophoria/modules/auth/business/auth.service';
import { GoogleAuthGuard } from '@trophoria/modules/auth/modules/googleAuth/boundary/guards/google-auth.guard';

@Controller('auth/google')
export class GoogleAuthController {
  constructor(
    @Inject(AuthServiceSymbol) private readonly authService: AuthService,
    private readonly config: ApiConfigService,
  ) {}

  @Get()
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {
    return;
  }

  @Get('successful')
  async successfulSignIn() {
    return;
  }

  @Get('redirect')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(
    @CurrentRestUser() { id }: User,
    @Res() reply: FastifyReply,
  ) {
    const { accessToken, refreshToken } =
      this.authService.generateTokenPair(id);

    reply.redirect(
      HttpStatus.TEMPORARY_REDIRECT,
      `/${this.config.get(
        'API_PREFIX',
      )}/auth/google/successful?token=${accessToken}&refresh=${refreshToken}`,
    );
  }
}
