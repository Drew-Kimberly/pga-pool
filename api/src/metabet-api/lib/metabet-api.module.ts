import { metabetApiConfigProvider } from './metabet-api.config';
import { MetabetApiService } from './metabet-api.service';

import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule.register({}), ConfigModule],
  providers: [metabetApiConfigProvider, MetabetApiService],
  exports: [MetabetApiService],
})
export class MetabetApiModule {}
