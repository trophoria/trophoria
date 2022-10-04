import { HttpStatus, Inject, UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { BasicResponse, GraphQLThrottlerGuard } from '@trophoria/libs/common';
import {
  PasswordResetService,
  PasswordResetSymbol,
} from '@trophoria/modules/auth/modules/passwordReset/business/password-reset.service';

@Resolver()
@UseGuards(GraphQLThrottlerGuard)
export class PasswordResetResolver {
  constructor(
    @Inject(PasswordResetSymbol)
    private readonly resetPasswordService: PasswordResetService,
  ) {}

  @Mutation((_returns) => BasicResponse, { name: 'requestPasswordReset' })
  async requestPasswordReset(@Args('email') email: string) {
    await this.resetPasswordService.requestPasswordReset(email);

    return {
      statusCode: HttpStatus.OK,
      message: 'successfully requested password reset',
    };
  }

  @Mutation((_returns) => BasicResponse, { name: 'resetPassword' })
  async resetPassword(
    @Args('token') token: string,
    @Args('newPassword') newPassword: string,
  ) {
    const { email } = await this.resetPasswordService.decodePasswordResetToken(
      token,
    );

    console.log(email);

    await this.resetPasswordService.resetPassword(email, newPassword);

    return {
      statusCode: HttpStatus.OK,
      message: 'password has been reset',
    };
  }
}
