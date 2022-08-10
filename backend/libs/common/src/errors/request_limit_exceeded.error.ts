import { HttpException, HttpStatus } from '@nestjs/common';

export class RequestLimitExceededException extends HttpException {
  constructor(request: number, period: number) {
    super(
      `You exceeded the permitted ${request}req / ${period}s.`,
      HttpStatus.TOO_MANY_REQUESTS,
    );
  }
}
