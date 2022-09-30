import { FileInterceptor, UploadedFile } from '@blazity/nest-file-fastify';
import {
  Controller,
  HttpStatus,
  Inject,
  Post,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { FastifyReply } from 'fastify';
import { User } from '@trophoria/graphql/user/user.model';

import { UploadFile } from '@trophoria/libs/common';
import { CurrentRestUser } from '@trophoria/modules/auth/boundary/decorators/user.decorator';
import { JwtRestAuthGuard } from '@trophoria/modules/auth/boundary/guards/jwt.guard';
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
  async uploadFile(
    @UploadedFile() file: UploadFile,
    @CurrentRestUser() user: User,
    @Res() reply: FastifyReply,
  ) {
    if (!['image/png'].includes(file.mimetype)) {
      return reply.status(HttpStatus.BAD_REQUEST).send({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'invalid file type - only png and jpeg files can be uploaded',
      });
    }

    const avatar = await this.userService.saveAvatar(user.id, {
      buffer: file.buffer,
      mimetype: file.mimetype,
    });

    return reply.status(HttpStatus.CREATED).send({
      statusCode: HttpStatus.CREATED,
      avatarUrl: avatar,
    });
  }
}
