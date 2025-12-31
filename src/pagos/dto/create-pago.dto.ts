import { Transform } from "class-transformer";
import { IsArray, IsDate, IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateIf } from "class-validator";
import { BrandExists } from "src/validators/brand-exists.validator";
import { SuscripcionExists } from "src/validators/suscription-exists.validator";
export class CreatePagoDto {
  @IsString()
  @IsNotEmpty({ message: "El id de la marca es requerida" })
  @BrandExists({ message: "El brandId proporcionado no existe en la colección brands" })
  brandId: string;

  // @IsUUID()
  @IsString()
  @IsNotEmpty({ message: "El id de la suscripción es requerida" })
  @SuscripcionExists({ message: "La suscriptionId no existe en la colección suscripcions" })
  suscriptionId: string;

  @IsNotEmpty({ message: "El tipo de pago es requerido" })
  @IsEnum(["transferencia", "billetera_digital", "pago_link"])
  tipo_pago: string;

  @ValidateIf((o) => o.tipo_pago === "transferencia")
  @IsNotEmpty({ message: "transferencia es requerida cuando tipo_pago es 'transferencia'" })
  @IsEnum(["bcp", "interbank"])
  transferencia?: string;

  @ValidateIf((o) => o.tipo_pago === "billetera_digital")
  @IsNotEmpty({ message: "billetera_digital es requerida cuanto tipo_pago es 'billetera_digital'" })
  @IsEnum(["yape", "plin"])
  billetera_digital: string;

  @ValidateIf((o) => o.tipo_pago === "pago_link")
  @IsNotEmpty({ message: "pago_link es requerida cuanto tipo_pago es 'pago_link'" })
  @IsString()
  pago_link: string;

  @IsString()
  @IsOptional()
  voucher_pago: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  notas: string[];

  @IsEnum(["completado", "cancelado", "pendiente"], {
    message: "status debe ser: 'completado', 'cancelado' o 'pendiente'"
  })
  @IsNotEmpty({ message: "status es requerido" })
  status: string;

  @IsOptional()
  @IsDate({ message: "fecha_pago debe ser una fecha válida (ej: 2025-12-16 o 2025-12-16T00:00:00.000Z)" })
  @Transform(({ value }) => {
    if (!value) return undefined;
    const date = new Date(value);
    return isNaN(date.getTime()) ? value : date;
  })
  fecha_pago?: Date;
}
