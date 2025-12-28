import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSuscripcionDto } from './dto/create-suscripcion.dto';

import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from "mongoose";

import { Suscripcion, SuscripcionDocument } from './entities/suscripcion.entity';

@Injectable()
export class SuscripcionesService {
  constructor(@InjectModel(Suscripcion.name) private suscModel: Model<SuscripcionDocument>) { }

  async createSuscriptionToPlan(suscripcionData: CreateSuscripcionDto): Promise<Suscripcion> {
    try {
      const createdSuscription = new this.suscModel(suscripcionData);
      return createdSuscription.save();
    } catch (error) {
      throw error;
    }
  }

  async getAllSuscriptions(
    planId?: string,
    brandId?: string
  ): Promise<Suscripcion | Suscripcion[]> {
    // Validar que no se usen múltiples criterios
    const paramsCount = [planId, brandId].filter(p => p).length;
    if (paramsCount > 1) {
      throw new BadRequestException({
        status: 400,
        message: "Use solo un criterio de búsqueda: id, planId o brandId",
        error: "Bad request"
      });
    }

    if (planId) return await this.getSuscriptionByPlanId(planId);
    if (brandId) return await this.getSuscriptionByBrandId(brandId);

    const foundSuscriptions = await this.suscModel.find().exec();
    if (!foundSuscriptions || foundSuscriptions.length === 0) {
      throw new NotFoundException({
        status: 404,
        message: "No se pudo encontrar ninguna suscripción",
        error: "Not found"
      });
    }
    return foundSuscriptions;
  }

  async getSuscriptionById(id: string): Promise<Suscripcion> {
    // Validar ObjectId
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException({
        status: 404,
        message: `Suscripción con ID ${id} no encontrada`,
        error: "Not found"
      });
    }

    const foundSuscription = await this.suscModel.findById(id);
    if (!foundSuscription || foundSuscription === null || undefined) {
      throw new NotFoundException({
        status: 404,
        message: `No se pudo encontrar la suscripción con id: ${id}`,
        error: "Not found"
      });
    }
    return foundSuscription;
  }

  async getSuscriptionByPlanId(planId: string): Promise<Suscripcion | Suscripcion[]> {
    const foundSuscription = await this.suscModel.find({
      planId
    });

    if (!foundSuscription || foundSuscription === null || undefined) {
      throw new NotFoundException({
        status: 404,
        message: `No se pudo encontrar la suscripción que tiene el plan con id: ${planId}`,
        error: "Not found"
      });
    }
    return foundSuscription;
  }

  async getSuscriptionByBrandId(brandId: string): Promise<Suscripcion | Suscripcion[]> {
    const foundSuscription = await this.suscModel.find({
      brandId
    });
    if (!foundSuscription || foundSuscription === null || undefined) {
      throw new NotFoundException({
        status: 404,
        message: `No se pudo encontrar la suscripción de la marca con id: ${brandId}`,
        error: "Not found"
      });
    }
    return foundSuscription;
  }

  // create(createSuscripcioneDto: CreateSuscripcioneDto) {
  //   return 'This action adds a new suscripcione';
  // }

  // findAll() {
  //   return `This action returns all suscripciones`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} suscripcione`;
  // }

  // update(id: number, updateSuscripcioneDto: UpdateSuscripcioneDto) {
  //   return `This action updates a #${id} suscripcione`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} suscripcione`;
  // }
}
