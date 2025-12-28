import { Controller, Get, Post, Body, Patch, Param, Delete, Query, BadRequestException } from '@nestjs/common';
import { SuscripcionesService } from './suscripciones.service';
import { CreateSuscripcionDto } from './dto/create-suscripcion.dto';

@Controller('suscripciones')
export class SuscripcionesController {
  constructor(private readonly suscService: SuscripcionesService) { }

  @Post()
  suscribeToPlan(@Body() suscripcionData: CreateSuscripcionDto) {
    const createdSuscription = this.suscService.createSuscriptionToPlan(suscripcionData);
    return createdSuscription;
  }

  @Get()
  findAllSuscriptions(
    @Query("planId") planId?: string,
    @Query("brandId") brandId?: string,
  ) {
    try {
      return this.suscService.getAllSuscriptions(
        planId,
        brandId
      );
    } catch (error) {
      throw error;
    }
  }

  @Get(":suscriptionId")
  findSuscriptionById(@Param("suscriptionId") suscriptionId: string) {
    try {
      return this.suscService.getSuscriptionById(suscriptionId);
    } catch (error) {
      throw error;
    }
  }

  // @Get("query")
  // findSuscription(
  //   @Query("planId") planId?: string,
  //   @Query("brandId") brandId?: string
  // ) {
  //   try {
  //     if (planId && brandId) {
  //       throw new BadRequestException({
  //         status: 400,
  //         message: "Debe proporcionar solo una de estos: planId o brandId",
  //         error: "Bad request"
  //       });
  //     }
  //     if (planId) {
  //       return this.suscService.getSuscriptionByPlanId(planId);
  //     }

  //     if (brandId) {
  //       return this.suscService.getSuscriptionByBrandId(brandId);
  //     }
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // @Post()
  // create(@Body() createSuscripcioneDto: CreateSuscripcioneDto) {
  //   return this.suscripcionesService.create(createSuscripcioneDto);
  // }

  // @Get()
  // findAll() {
  //   return this.suscripcionesService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.suscripcionesService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateSuscripcioneDto: UpdateSuscripcioneDto) {
  //   return this.suscripcionesService.update(+id, updateSuscripcioneDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.suscripcionesService.remove(+id);
  // }
}
