import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateSuscripcionDto } from './create-suscripcion.dto';

export class UpdateSuscripcionDto extends PartialType(
  OmitType(
    CreateSuscripcionDto,
    ["brandId", "planId"]
  )
) {}
