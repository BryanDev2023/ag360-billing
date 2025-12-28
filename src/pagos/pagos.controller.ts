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

  // @Get()
  // findPaymentOrAll(@Query('id') id?: string) {
  //   try {
  //     if (id) {
  //       return this.pagosService.findPaymentById(id);
  //     }
  //     return this.pagosService.findAllPayments();
  //   } catch (error) {

  //   }
  // }

  // @Get(":paymentId")
  // findPaymentOrAll(@Param('id') id?: string) {
  //   try {
  //     if (id) {
  //       return this.pagosService.findPaymentById(id);
  //     }
  //     return this.pagosService.findAllPayments();
  //   } catch (error) {
  //     throw error;
  //   }
  // }
  // @Post()
  // create(@Body() createPagoDto: CreatePagoDto) {
  //   return this.pagosService.create(createPagoDto);
  // }

  // @Get()
  // findAll() {
  //   return this.pagosService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.pagosService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updatePagoDto: UpdatePagoDto) {
  //   return this.pagosService.update(+id, updatePagoDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.pagosService.remove(+id);
  // }
}
