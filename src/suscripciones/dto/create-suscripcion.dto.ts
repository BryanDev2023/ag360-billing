import { Transform } from "class-transformer";
import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateIf } from "class-validator";
import { BrandExists } from "src/validators/brand-exists.validator";
import { PlanExists } from "src/validators/plan-exists.validator";

export class CreateSuscripcionDto {
  @IsString()
  @BrandExists({ message: "El brandId proporcionado no existe en la colección brands" })
  brandId: string;

  @IsString()
  @PlanExists({ message: "El planId proporcionado no existe en la colección plans" })
  planId: string;

  @IsOptional()
  @IsDate({ message: "start_date debe ser una fecha válida (ej: 2025-12-16 o 2025-12-16T00:00:00.000Z)" })
  @Transform(({ value }) => {
    if (!value) return undefined;
    const date = new Date(value);
    return isNaN(date.getTime()) ? value : date;
  })
  start_date?: Date;

  @IsOptional()
  @IsDate({ message: "renovate_date debe ser una fecha válida (ej: 2025-12-16 o 2025-12-16T00:00:00.000Z)" })
  @Transform(({ value }) => {
    if (!value) return undefined;
    const date = new Date(value);
    return isNaN(date.getTime()) ? value : date;
  })
  renovate_date?: Date;

  @IsString()
  @IsEnum(["transferencia", "billetera_digital", "pago_link"], {
    message: "tipo_pago debe ser: 'transferencia', 'billetera_digital' o 'pago_link'"
  })
  @IsNotEmpty({ message: "tipo_pago es requerido" })
  tipo_pago?: "transferencia" | "billetera_digital"| "pago_link";

  @IsString()
  @IsNotEmpty({ message: "provider es requerido" })
  provider: string;

  @IsEnum(["activo", "inactivo"], {
    message: "status debe ser: 'activo' o 'inactivo'"
  })
  @IsNotEmpty({ message: "status es requerido" })
  status: string;
}
