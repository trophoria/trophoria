import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';

import { ApiConfigService } from '@trophoria/modules/_setup/config/api-config.service';
import {
  UserService,
  UserServiceSymbol,
} from '@trophoria/modules/user/business/user.service';

@Injectable()
export class GoogleAuthStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    readonly configService: ApiConfigService,
    @Inject(UserServiceSymbol)
    private readonly userService: UserService,
  ) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get('GOOGLE_REDIRECT_URL'),
      scope: ['email', 'profile'],
    });
  }

  async validate(_: never, __: never, profile: Profile) {
    const { id, emails, profileUrl, username } = profile;

    const user = await this.userService.findByProvider('google', id);
    if (user) return user;

    const verifiedMails = emails.filter((email) => email.verified);

    return await this.userService.create({
      email: verifiedMails[0].value ?? emails[0].value,
      username: username,
      avatar: profileUrl,
      isVerified: verifiedMails.length > 0,
      payload: {
        provider: 'google',
        providerId: id,
      },
    });
  }
}
