import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSuscripcionDto } from './dto/create-suscripcion.dto';

import { InjectModel } from '@nestjs/mongoose';
import { DeleteResult, Model, Types } from "mongoose";

import { Suscripcion, SuscripcionDocument } from './entities/suscripcion.entity';
import { UpdateSuscripcionDto } from './dto/update-suscripcion.dto';

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

  async findAndUpdateSuscriptionById(
    suscriptionId: string,
    updateData: UpdateSuscripcionDto
  ): Promise<Suscripcion> {
    if (!Types.ObjectId.isValid(suscriptionId)) {
      throw new NotFoundException({
        status: 404,
        message: `No se pudo encontrar la suscripción del id '${suscriptionId}' y por ende no se puede actualizar...`,
        error: "Not found"
      });
    }

    const updatedSuscription = await this.suscModel
      .findByIdAndUpdate(
        suscriptionId,
        updateData,
        { new: true }
      )
      .exec();

    if (!updatedSuscription) {
      throw new NotFoundException({
        status: 404,
        message: `No se pudo encontrar la suscripción del id '${suscriptionId}' y por ende no se puede actualizar...`,
        error: "Not found"
      });
    }
    return updatedSuscription;
  }

  async removeAllSuscriptions(
    planId?: string,
    brandId?: string
  ): Promise<DeleteResult> {
    if (brandId) return await this.removeSuscriptionsByBrandId(brandId);
    if (planId) return await this.removeSuscriptionsByPlanId(planId);

    const deletedResult = await this.suscModel
      .deleteMany()
      .exec();

    if (!deletedResult) {
      throw new NotFoundException({
        status: 404,
        message: "No se pudo encontrar ninguna suscripción, por ende no hay nada que borrar",
        error: "Not found"
      });
    }
    return deletedResult;
  }

  async removeSuscriptionById(suscId: string): Promise<Suscripcion> {
    if (!Types.ObjectId.isValid(suscId)) {
      throw new NotFoundException({
        status: 404,
        message: `No se pudo encontrar la suscripción con id '${suscId}' y por ende no se puede eliminar...`,
        error: "Not found"
      });
    }

    const removedSuscription = await this.suscModel
      .findByIdAndDelete(suscId)
      .exec();

    if (!removedSuscription) {
      throw new NotFoundException({
        status: 404,
        message: `No se pudo encontrar la suscripción con id '${suscId}' y por ende no se puede eliminar...`,
        error: "Not found"
      });
    }
    return removedSuscription;
  }

  async removeSuscriptionsByPlanId(planId: string) {
    const deletedResult = await this.suscModel.deleteMany({
      planId
    });

    if (!deletedResult) {
      throw new NotFoundException({
        status: 404,
        message: `No se pudo encontrar ninguna suscripción con el planId ${planId}, por ende no hay nada que borrar`,
        error: "Not found"
      });
    }
    return deletedResult;
  }

  async removeSuscriptionsByBrandId(brandId: string): Promise<DeleteResult> {
    const deletedResult = await this.suscModel.deleteMany({
      brandId
    });
    if (!deletedResult) {
      throw new NotFoundException({
        status: 404,
        message: `No se pudo encontrar ninguna suscripción con el brandId ${brandId}, por ende no hay nada que borrar`,
        error: "Not found"
      });
    }
    return deletedResult;
  }
}
