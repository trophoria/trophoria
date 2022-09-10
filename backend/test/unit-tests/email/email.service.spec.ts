import { Test } from '@nestjs/testing';
import sgMail from '@sendgrid/mail';

import { ApiConfigModule } from '@trophoria/modules/_setup/config/api-config.module';
import {
  EmailService,
  EmailServiceSymbol,
  SendgridService,
} from '@trophoria/modules/email';

jest.mock('@sendgrid/mail', () => {
  return {
    setApiKey: jest.fn(),
    send: jest.fn(() => ({ statusCode: 200, message: 'email sent' })),
  };
});

describe('EmailService', () => {
  let service: EmailService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [{ provide: EmailServiceSymbol, useClass: SendgridService }],
      imports: [ApiConfigModule],
    }).compile();

    service = moduleRef.get<EmailService>(EmailServiceSymbol);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should send mail with specific value', () => {
    service.send({
      to: 'receiver@mail.com',
      subject: 'This is a unit test',
      html: '<h1>Hello World!</h1>',
    });

    expect(sgMail.send).toBeCalledWith({
      to: 'receiver@mail.com',
      subject: 'This is a unit test',
      html: '<h1>Hello World!</h1>',
    });
  });
});
