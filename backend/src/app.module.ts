import { Module } from '@nestjs/common';

import { Modules, Providers } from '@trophoria/modules';

@Module({ imports: Modules, providers: Providers })
export class AppModule {}
