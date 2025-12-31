import { IsString, IsNumber, IsArray, IsObject, IsEnum, IsOptional, ValidateNested, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { PlanDuration, type PlanStatus } from "src/types/reponses";
import type { Features } from "../entities/plan.entity";

class FeaturesDto {
  @IsBoolean()
  ai_agent: boolean;

  @IsBoolean()
  priority_support: boolean;
}

export class CreatePlanDto {
  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsEnum(PlanDuration)
  duration: PlanDuration;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  modules_included?: string[];

  @IsNumber()
  order_limit: number;

  @IsObject()
  @ValidateNested()
  @Type(() => FeaturesDto)
  features: Features;

  @IsEnum(['active', 'inactive'])
  status: PlanStatus;
}