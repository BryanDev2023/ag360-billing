import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Brand, BrandDocument } from './entities-externas/brand.entity';

@ValidatorConstraint({ name: 'BrandExists', async: true })
@Injectable()
export class BrandExistsConstraint implements ValidatorConstraintInterface {
  constructor(@InjectModel(Brand.name) private brandModel: Model<BrandDocument>) {}

  async validate(brandId: string, _args: ValidationArguments): Promise<boolean> {
    if (!brandId) {
      return false;
    }
    // Verificar que sea un ObjectId válido
    if (!Types.ObjectId.isValid(brandId)) {
      return false;
    }
    try {
      const brand = await this.brandModel.findById(brandId).exec();
      return !!brand;
    } catch (error) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments): string {
    return `El brandId '${args.value}' no existe en la colección brands`;
  }
}

export function BrandExists(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: BrandExistsConstraint,
    });
  };
}

