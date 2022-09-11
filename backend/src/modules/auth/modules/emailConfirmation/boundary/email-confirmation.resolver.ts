import { HttpStatus, Inject, UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { User } from '@trophoria/graphql/user/user.model';

import { BasicResponse, GraphQLThrottlerGuard } from '@trophoria/libs/common';
import { CurrentUser } from '@trophoria/modules/auth/boundary/decorators/user.decorator';
import { JwtAuthGuard } from '@trophoria/modules/auth/boundary/guards/jwt.guard';
import {
  EmailConfirmationService,
  EmailConfirmationSymbol,
} from '@trophoria/modules/auth/modules/emailConfirmation/business/email-confirmation.service';

@Resolver()
@UseGuards(GraphQLThrottlerGuard)
export class EmailConfirmationResolver {
  constructor(
    @Inject(EmailConfirmationSymbol)
    private readonly emailConfirmationService: EmailConfirmationService,
  ) {}

  @Mutation((_returns) => BasicResponse, { name: 'confirm' })
  async confirm(@Args('token') token: string) {
    const { id } = await this.emailConfirmationService.decodeVerificationToken(
      token,
    );

    await this.emailConfirmationService.confirmEmail(id);

    return {
      statusCode: HttpStatus.OK,
      message: 'email successfully verified',
    };
  }

  @Mutation((_returns) => User, { name: 'resendConfirmationLink' })
  @UseGuards(JwtAuthGuard)
  async resendConfirmationLink(@CurrentUser() user: User) {
    await this.emailConfirmationService.resendConfirmationLink(user.id);
  }
}
