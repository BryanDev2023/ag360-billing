import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PagosService } from './pagos.service';
import { PagosController } from './pagos.controller';
import { Pago, PagoSchema } from './entities/pago.entity';
import { Brand, BrandSchema } from 'src/validators/entities-externas/brand.entity';
import { BrandExistsConstraint } from 'src/validators/brand-exists.validator';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Pago.name, schema: PagoSchema },
      { name: Brand.name, schema: BrandSchema },
    ]),
  ],
  controllers: [PagosController],
  providers: [PagosService, BrandExistsConstraint],
  exports: [PagosService]
})
export class PagosModule {}
