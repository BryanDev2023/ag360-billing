import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';

import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from "mongoose";

import { Pago, PagosDocument } from './entities/pago.entity';
import { DeletePaymentResponse, ResponseGeneral } from 'src/types/reponses';
import { CloudinaryService } from 'src/core/cloudinary/image.service';

@Injectable()
export class PagosService {
  constructor(
    @InjectModel(Pago.name) private readonly pagosModel: Model<PagosDocument>,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  async registerPayment(registerData: CreatePagoDto): Promise<Pago> {
    try {
      const registedPayment = new this.pagosModel(registerData);
      return registedPayment.save();
    } catch (error) {
      throw error;
    }
  }

  async findAllPayments(): Promise<Pago[]> {
    const foundPayments = await this.pagosModel.find().exec();
    if (!foundPayments || foundPayments.length === 0) {
      throw new NotFoundException({
        status: 404,
        message: "No se pudo encontrar ningun pago",
        error: "Not found"
      });
    }
    return foundPayments;
  }

  async findPaymentById(id: string): Promise<Pago> {
    const foundPayment = await this.pagosModel.findById(id).exec();
    if (!foundPayment || foundPayment === null || undefined) {
      throw new NotFoundException({
        status: 404,
        message: `No se pudo encontrar el pago con id: ${id}`,
        error: "Not found"
      });
    }
    return foundPayment;
  }

  async findAndUpdateById(
    paymentId: string,
    updateData: UpdatePagoDto
  ): Promise<Pago> {
    if (!Types.ObjectId.isValid(paymentId)) {
      throw new NotFoundException({
        status: 404,
        message: `No se pudo encontrar el pago del id '${paymentId}' y por ende no se puede actualizar...`,
        error: "Not found"
      });
    }

    const updatedPayment = await this.pagosModel
      .findByIdAndUpdate(
        paymentId,
        updateData,
        { new: true }
      )
      .exec();

    if (!updatedPayment) {
      throw new NotFoundException({
        status: 404,
        message: `No se pudo encontrar el pago del id '${paymentId}' y por ende no se puede actualizar...`,
        error: "Not found"
      });
    }
    return updatedPayment;
  }

  async removePaymentById(paymentId: string): Promise<Pago> {
    if (!Types.ObjectId.isValid(paymentId)) {
      throw new NotFoundException({
        status: 404,
        message: `No se pudo encontrar el pago con id '${paymentId}' y por ende no se puede eliminar...`,
        error: "Not found"
      });
    }

    const removedPayment = await this.pagosModel
      .findByIdAndDelete(paymentId)
      .exec();

    if (!removedPayment) {
      throw new NotFoundException({
        status: 404,
        message: `No se pudo encontrar el pago con id '${paymentId}' y por ende no se puede eliminar...`,
        error: "Not found"
      });
    }
    return removedPayment;
  }

  async removeAllPayments(): Promise<DeletePaymentResponse> {
    const { deletedCount } = await this.pagosModel.deleteMany().exec();
    
    if (deletedCount === 0) {
      const resultFailed: DeletePaymentResponse = {
        success: false,
        message: "No se encontro ningun pago para eliminar",
        deletedCount
      }
      return resultFailed;
    }

    const resultSuccesfully: DeletePaymentResponse = {
      success: true,
      message: "Se pudieron eliminar todos los pagos exitosamente",
      deletedCount
    }
    return resultSuccesfully;
  }

  async uploadVoucherPayment(
    paymentId: string,
    voucherFile: Express.Multer.File
  ): Promise<Pago> {
    const voucherPhotoUrl = await this.cloudinaryService.uploadImage(voucherFile);
    const updatedPayment = await  this.findAndUpdateById(
      paymentId,
      { voucher_pago: voucherPhotoUrl }
    );
    return updatedPayment;
  }

  async deleteVoucher(paymentId: string): Promise<ResponseGeneral> {
    const { voucher_pago } = await this.findPaymentById(paymentId);
    
    if (!voucher_pago || voucher_pago === "") {
      throw new NotFoundException({
        status: 404,
        message: "No se pudo encontrar el voucher",
        error: "Not found voucher"
      })
    }
    
    await this.cloudinaryService.deleteImage(voucher_pago);
    await this.findAndUpdateById(
      paymentId,
      { voucher_pago: null }
    );

    return { success: true, message: "Voucher eliminado exitosamente" }
  }
}
