import { Inject, UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User, UserCreateInput } from '@trophoria/graphql';

import {
  CookieMap,
  Cookies,
  GraphQLContext,
  GraphQLThrottlerGuard,
} from '@trophoria/libs/common';
import { secureCookieOptions } from '@trophoria/libs/core';
import { CurrentUser } from '@trophoria/modules/auth/boundary/decorators/user.decorator';
import { AuthenticationInput } from '@trophoria/modules/auth/boundary/dto/authentication-input.model';
import { SignOutResponse } from '@trophoria/modules/auth/boundary/dto/sign-out-response.model';
import { TokenPayload } from '@trophoria/modules/auth/boundary/dto/token-payload.model';
import { JwtRefreshGuard } from '@trophoria/modules/auth/boundary/guards/jwt-refresh.guard';
import { JwtAuthGuard } from '@trophoria/modules/auth/boundary/guards/jwt.guard';
import { LocalAuthenticationGuard } from '@trophoria/modules/auth/boundary/guards/local-authentication.guard';
import {
  AuthService,
  AuthServiceSymbol,
} from '@trophoria/modules/auth/business/auth.service';
import { UserService, UserServiceSymbol } from '@trophoria/modules/user';

@Resolver()
@UseGuards(GraphQLThrottlerGuard)
export class AuthResolver {
  constructor(
    @Inject(AuthServiceSymbol) private readonly authService: AuthService,
    @Inject(UserServiceSymbol) private readonly userService: UserService,
  ) {}

  @Mutation((_returns) => User, { name: 'sign_up' })
  async signUp(@Args('user_input') user: UserCreateInput) {
    return this.authService.signUp(user);
  }

  @Mutation((_returns) => TokenPayload, { name: 'sign_in' })
  @UseGuards(LocalAuthenticationGuard)
  async signIn(
    @CurrentUser() user: User,
    @Cookies() cookies: CookieMap,
    @Context() { reply }: GraphQLContext,
    @Args('credentials') _credentials: AuthenticationInput,
  ) {
    const { accessToken, refreshToken, reuseDetected } =
      await this.authService.signIn(user, cookies.REFRESH);

    if (reuseDetected) reply.clearCookie('REFRESH', secureCookieOptions);
    reply.setCookie('REFRESH', refreshToken, secureCookieOptions);

    return { accessToken, refreshToken, reuseDetected };
  }

  @Mutation((_returns) => SignOutResponse, { name: 'sign_out' })
  @UseGuards(JwtAuthGuard)
  async signOut(
    @CurrentUser() user: User,
    @Context() { reply }: GraphQLContext,
  ) {
    reply.clearCookie('REFRESH', secureCookieOptions);
    return this.authService.signOut(user.id);
  }

  @Mutation((_returns) => TokenPayload, { name: 'refresh_tokens' })
  @UseGuards(JwtRefreshGuard)
  async refresh(
    @CurrentUser() user: User,
    @Context() { reply }: GraphQLContext,
  ) {
    const tokenPayload = await this.authService.refreshToken(user);
    reply.setCookie('REFRESH', tokenPayload.refreshToken, secureCookieOptions);
    return tokenPayload;
  }

  @Query((_returns) => User, { name: 'me' })
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUser() user: User) {
    return user;
  }
}
