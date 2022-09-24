import { FileInterceptor, UploadedFile } from '@blazity/nest-file-fastify';
import {
  Controller,
  HttpStatus,
  Inject,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

import { User } from '@trophoria/graphql/index';
import { CurrentRestUser } from '@trophoria/modules/auth/boundary/decorators/user.decorator';
import { JwtRestAuthGuard } from '@trophoria/modules/auth/boundary/guards/jwt.guard';
import { File } from '@trophoria/modules/file';
import {
  UserService,
  UserServiceSymbol,
} from '@trophoria/modules/user/business/user.service';

@UseGuards(ThrottlerGuard)
@Controller('user')
export class UserController {
  constructor(
    @Inject(UserServiceSymbol) private readonly userService: UserService,
  ) {}

  @Post('avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  @UseGuards(JwtRestAuthGuard)
  async uploadFile(@UploadedFile() file: File, @CurrentRestUser() user: User) {
    const avatar = await this.userService.saveAvatar(user.id, file);

    return {
      statusCode: HttpStatus.CREATED,
      avatarUrl: avatar,
    };
  }
}
