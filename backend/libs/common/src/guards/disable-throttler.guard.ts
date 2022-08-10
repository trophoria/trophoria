import { SetMetadata } from '@nestjs/common';

export const DisableThrottler = () => SetMetadata('disableThrottler', true);
