import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JwtPayload } from '@trophoria/libs/common';
import { ApiConfigService } from '@trophoria/modules/_setup/config/api-config.service';
import { UserService, UserServiceSymbol } from '@trophoria/modules/user';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ApiConfigService,
    @Inject(UserServiceSymbol) private userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          const authHeader = req.headers.authorization;

          if (
            !authHeader ||
            !authHeader.match(/^Bearer\s[^.]*.\.[^.]*.\.[^.]*.$/)
          ) {
            return '';
          }

          return req.headers.authorization.split(' ')[1];
        },
      ]),
      secretOrKey: configService.get('JWT_PUBLIC_KEY'),
    });
  }

  async validate(payload: JwtPayload) {
    return this.userService.findById(payload.id);
  }
}
