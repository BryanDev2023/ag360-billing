import { IsString } from "class-validator";

export class DeletePlanDto {
  @IsString({ each: true })
  ids: string[];
}
