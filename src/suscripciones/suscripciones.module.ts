import { Module } from '@nestjs/common';
import { SuscripcionesService } from './suscripciones.service';
import { SuscripcionesController } from './suscripciones.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Suscripcion, SuscripcionSchema } from './entities/suscripcion.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Suscripcion.name, schema: SuscripcionSchema }
    ])
  ],
  controllers: [SuscripcionesController],
  providers: [SuscripcionesService],
})
export class SuscripcionesModule {}
