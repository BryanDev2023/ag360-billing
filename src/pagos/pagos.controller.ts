import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PagosService } from './pagos.service';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';

@Controller('pagos')
export class PagosController {
  constructor(private readonly pagosService: PagosService) { }

  @Post()
  registerPayment(@Body() registerData: CreatePagoDto) {
    const registedPayment = this.pagosService.registerPayment(registerData);
    return registedPayment;
  }

  @Get()
  findAllPayment() {
    try {
      return this.pagosService.findAllPayments();
    } catch (error) {
      throw error;
    }
  }

  @Get(":paymentId")
  findPayment(@Param("paymentId") paymentId: string) {
    try {
      return this.pagosService.findPaymentById(paymentId);
    } catch (error) {
      throw error;
    }
  }

  @Patch(":paymentId")
  updatePayment(
    @Param("paymentId") paymentId: string,
    @Body() updatePagoDto: UpdatePagoDto
  ) {
    try {
      return this.pagosService.findAndUpdateById(
        paymentId,
        updatePagoDto
      );
    } catch (error) {
      throw error;
    }
  }

  @Delete("all")
  removeAllPayments() {
    try {
      return this.pagosService.removeAllPayments();
    } catch (error) {
      throw error;
    }
  }

  @Delete(":paymentId")
  removePayment(@Param("paymentId") paymentId: string) {
    try {
      return this.pagosService.removePaymentById(paymentId);
    } catch (error) {
      throw error;
    }
  }
}
