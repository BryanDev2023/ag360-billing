import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlanesService } from './planes.service';
import { PlanesController } from './planes.controller';
import { Plan, PlanSchema } from './entities/plan.entity';
import { PlanExistsConstraint } from 'src/validators/plan-exists.validator';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Plan.name, schema: PlanSchema }
    ]),
  ],
  controllers: [PlanesController],
  providers: [PlanesService, PlanExistsConstraint],
  exports: [PlanesService, PlanExistsConstraint],
})
export class PlanesModule {}
