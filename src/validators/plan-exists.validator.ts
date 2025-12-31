import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from "class-validator";

import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from 'mongoose';
import { Plan, PlanDocument } from "src/planes/entities/plan.entity";

@ValidatorConstraint({ name: "PlanExists", async: true })
@Injectable()
export class PlanExistsConstraint implements ValidatorConstraintInterface {
  constructor (@InjectModel(Plan.name) private planModel: Model<PlanDocument>) {}

  async validate(planId: string, _args: ValidationArguments): Promise<boolean> {
    if (!planId) return false;

    // Verificar que sea un ObjectId válido
    if (!Types.ObjectId.isValid(planId)) return false;
    
    try {
      const plan = await this.planModel.findById(planId).exec();
      return !!plan;
    } catch (error) {
      return false;
    }
  }

  defaultMessage(args?: ValidationArguments): string {
    return `El plandId '${args?.value}' no existe en la colección plans`
  }
}

export function PlanExists(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: PlanExistsConstraint,
    });
  };
}
