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

import { Suscripcion, SuscripcionDocument } from "src/suscripciones/entities/suscripcion.entity";

export class SuscripcionExistsConstraint implements ValidatorConstraintInterface {
  constructor(@InjectModel(Suscripcion.name) private suscModel: Model<SuscripcionDocument>) { }

  async validate(suscId: string, _arg: ValidationArguments): Promise<boolean> {
    if (!suscId) return false;

    // Verificar que sea un ObjectId válido
    if (!Types.ObjectId.isValid(suscId)) return false;

    try {
      const suscription = await this.suscModel.findById(suscId).exec();
      return !!suscription;
    } catch (error) {
      return false;
    }
  }

  defaultMessage(args?: ValidationArguments): string {
    return `La suscriptionId '${args?.value}' no existe en la colección suscripcions`
  }
}

export function SuscripcionExists(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: SuscripcionExistsConstraint,
    });
  };
}
