import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from "mongoose";

import { Pago, PagosDocument } from './entities/pago.entity';

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
