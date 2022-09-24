import {
  FileInterceptor,
  UploadedFile,
  StorageFile,
} from '@blazity/nest-file-fastify';
import { Controller, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@UseGuards(ThrottlerGuard)
@Controller('user')
export class UserController {
  @Post('avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  uploadFile(@UploadedFile() file: StorageFile) {
    console.log(file);
  }
}
