import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlanesModule } from './planes/planes.module';
import { PagosModule } from './pagos/pagos.module';
import { SuscripcionesModule } from './suscripciones/suscripciones.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB'),
        dbName: 'servicios-generales-prod',
      }),
      inject: [ConfigService],
    }),
    PlanesModule,
    PagosModule,
    SuscripcionesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
