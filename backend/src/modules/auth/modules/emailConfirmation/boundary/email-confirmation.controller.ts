import {
  Controller,
  Get,
  HttpStatus,
  Inject,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { User } from '@trophoria/graphql';
import { CurrentUser } from '@trophoria/modules/auth/boundary/decorators/user.decorator';
import { JwtAuthGuard } from '@trophoria/modules/auth/boundary/guards/jwt.guard';

import {
  EmailConfirmationService,
  EmailConfirmationSymbol,
} from '@trophoria/modules/auth/modules/emailConfirmation/business/email-confirmation.service';

@UseGuards(ThrottlerGuard)
@Controller('email-confirmation')
export class EmailConfirmationController {
  constructor(
    @Inject(EmailConfirmationSymbol)
    private readonly emailConfirmationService: EmailConfirmationService,
  ) {}

  @Get('confirm')
  async confirm(@Query('token') token: string) {
    const { id } = await this.emailConfirmationService.decodeVerificationToken(
      token,
    );

    await this.emailConfirmationService.confirmEmail(id);

    return {
      statusCode: HttpStatus.OK,
      message: 'email successfully verified',
    };
  }

  @Post('resend-confirmation-link')
  @UseGuards(JwtAuthGuard)
  async resendConfirmationLink(@CurrentUser() user: User) {
    await this.emailConfirmationService.resendConfirmationLink(user.id);
  }
}
