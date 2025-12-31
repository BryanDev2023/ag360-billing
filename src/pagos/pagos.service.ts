import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';

import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from "mongoose";

import { Pago, PagosDocument } from './entities/pago.entity';
import { DeletePaymentResponse } from 'src/types/reponses';

@Injectable()
export class PagosService {
  constructor(@InjectModel(Pago.name) private pagosModel: Model<PagosDocument>) {}

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
}
// export class PagosService {
//   create(createPagoDto: CreatePagoDto) {
//     return 'This action adds a new pago';
//   }

//   findAll() {
//     return `This action returns all pagos`;
//   }

//   findOne(id: number) {
//     return `This action returns a #${id} pago`;
//   }

//   update(id: number, updatePagoDto: UpdatePagoDto) {
//     return `This action updates a #${id} pago`;
//   }

//   remove(id: number) {
//     return `This action removes a #${id} pago`;
//   }
// }
