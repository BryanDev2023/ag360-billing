import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSuscripcionDto } from './dto/create-suscripcion.dto';

import { InjectModel } from '@nestjs/mongoose';
import { DeleteResult, Model, Types } from "mongoose";

import { Suscripcion, SuscripcionDocument } from './entities/suscripcion.entity';
import { UpdateSuscripcionDto } from './dto/update-suscripcion.dto';
import { PagosService } from '../pagos/pagos.service';
import { PlanesService } from '../planes/planes.service';

@Injectable()
export class SuscripcionesService {
  constructor(
    @InjectModel(Suscripcion.name) private suscModel: Model<SuscripcionDocument>,
    private readonly pagosService: PagosService,
    private readonly planesService: PlanesService
  ) { }

  async createSuscriptionToPlan(suscripcionData: CreateSuscripcionDto): Promise<Suscripcion> {
    // Obtener el plan para calcular la fecha de renovación
    const plan = await this.planesService.findPlanById(suscripcionData.planId);

    // Calcular la fecha de inicio (por defecto: fecha actual)
    const startDate = suscripcionData.start_date || new Date();

    // Calcular automáticamente la fecha de renovación basada en la duración del plan
    let renovateDate: Date;
    if (suscripcionData.renovate_date) {
      // Si se proporciona manualmente, usar esa fecha
      renovateDate = suscripcionData.renovate_date;
    } else {
      // Calcular basado en la duración del plan
      renovateDate = this.calculateRenovateDate(startDate, plan.duration);
    }

    // Crear la suscripción con la fecha de renovación calculada
    const suscripcionToSave = {
      ...suscripcionData,
      start_date: startDate,
      renovate_date: renovateDate
    };

    const createdSuscription = new this.suscModel(suscripcionToSave);
    const savedSuscription = await createdSuscription.save();

    // Crear automáticamente un pago asociado a la suscripción
    // Ya que una suscripción técnicamente es cuando alguien paga un servicio
    const fechaPago = startDate;

    const pago = {
      brandId: suscripcionData.brandId,
      suscriptionId: savedSuscription._id.toString(),
      status: "pendiente",
      fecha_pago: fechaPago,
      voucher_pago: "",
      nota: []
    }

    const tipoPago = suscripcionData.tipo_pago;
    const paymentData = { ...pago, tipo_pago: tipoPago }

    let paymentDataWithProvider: any;

    if (tipoPago === "transferencia") {
      paymentDataWithProvider = { ...paymentData, transferencia: suscripcionData.provider };
    }
    if (tipoPago === "billetera_digital") {
      paymentDataWithProvider = { ...paymentData, billetera_digital: suscripcionData.provider };
    }
    if (tipoPago === "pago_link") {
      paymentDataWithProvider = { ...paymentData, pago_link: suscripcionData.provider };
    }

    await this.pagosService.registerPayment(paymentDataWithProvider)
    return savedSuscription;
  }

  /**
   * Calcula la fecha de renovación basada en la fecha de inicio y la duración del plan
   */
  private calculateRenovateDate(startDate: Date, duration: string): Date {
    const renovateDate = new Date(startDate);

    switch (duration) {
      case 'monthly':
        // Plan mensual: +1 mes
        renovateDate.setMonth(renovateDate.getMonth() + 1);
        break;
      case 'annual':
        // Plan anual: +1 año
        renovateDate.setFullYear(renovateDate.getFullYear() + 1);
        break;
      case 'semester':
        // Plan semestral: +6 meses
        renovateDate.setMonth(renovateDate.getMonth() + 6);
        break;
      case 'quarter':
        // Plan trimestral: +3 meses
        renovateDate.setMonth(renovateDate.getMonth() + 3);
        break;
      case 'biweekly':
        // Plan quincenal: +15 días
        renovateDate.setDate(renovateDate.getDate() + 15);
        break;
      default:
        // Por defecto: +1 mes
        renovateDate.setMonth(renovateDate.getMonth() + 1);
        break;
    }

    return renovateDate;
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
