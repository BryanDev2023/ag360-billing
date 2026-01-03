import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { PagosService } from './pagos.service';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('pagos')
export class PagosController {
  constructor(private readonly pagosService: PagosService) { }

  @Post()
  async registerPayment(@Body() registerData: CreatePagoDto) {
    const registedPayment = await this.pagosService.registerPayment(registerData);
    return registedPayment;
  }

  @Get()
  async findAllPayment() {
    try {
      return await this.pagosService.findAllPayments();
    } catch (error) {
      throw error;
    }
  }

  @Get(":paymentId")
  async findPayment(@Param("paymentId") paymentId: string) {
    try {
      return await this.pagosService.findPaymentById(paymentId);
    } catch (error) {
      throw error;
    }
  }

  @Patch(":paymentId")
  async updatePayment(
    @Param("paymentId") paymentId: string,
    @Body() updatePagoDto: UpdatePagoDto
  ) {
    try {
      return await this.pagosService.findAndUpdateById(
        paymentId,
        updatePagoDto
      );
    } catch (error) {
      throw error;
    }
  }

  @Patch(":paymentId/upload-voucher")
  @UseInterceptors(FileInterceptor("voucher"))
  async uploadVoucherPayment(
    @Param("paymentId") paymentId: string,
    @UploadedFile() voucherFile: Express.Multer.File
  ) {
    try {
      const paymentWithVoucher = await this.pagosService.uploadVoucherPayment(
        paymentId,
        voucherFile
      );
      return paymentWithVoucher;
    } catch (error) {
      throw error;
    }
  }

  @Delete(":paymentId/delete-voucher")
  async deleteVoucher(@Param("paymentId") paymentId: string) {
    try {
      return await this.pagosService.deleteVoucher(paymentId);
    } catch (error) {
      throw error;
    }
  }

  @Delete("all")
  async removeAllPayments() {
    try {
      return await this.pagosService.removeAllPayments();
    } catch (error) {
      throw error;
    }
  }

  @Delete(":paymentId")
  async removePayment(@Param("paymentId") paymentId: string) {
    try {
      return await this.pagosService.removePaymentById(paymentId);
    } catch (error) {
      throw error;
    }
  }
}
