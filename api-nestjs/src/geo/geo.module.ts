import { Module } from '@nestjs/common';
import { GeoController } from './geo.controller';
import { GeoService } from './geo.service';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    CacheModule.register({
      ttl: 60 * 5,
      isGlobal: false,
    }),
  ],
  controllers: [GeoController],
  providers: [GeoService],
})
export class GeoModule {} 