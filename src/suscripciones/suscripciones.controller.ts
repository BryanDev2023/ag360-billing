import { Controller, Get, Post, Body, Patch, Param, Delete, Query, BadRequestException } from '@nestjs/common';
import { SuscripcionesService } from './suscripciones.service';
import { CreateSuscripcionDto } from './dto/create-suscripcion.dto';
import { UpdateSuscripcionDto } from './dto/update-suscripcion.dto';

@Controller('suscripciones')
export class SuscripcionesController {
  constructor(private readonly suscService: SuscripcionesService) { }

  @Post()
  suscribeToPlan(@Body() suscripcionData: CreateSuscripcionDto) {
    try {
      const createdSuscription = this.suscService.createSuscriptionToPlan(suscripcionData);
      return createdSuscription;
    } catch (error) {
      throw error;
    }
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

  @Patch(":suscriptionId")
  updateSuscription(
    @Param("suscriptionId") suscId: string,
    @Body() updateData: UpdateSuscripcionDto
  ) {
    try {
      return this.suscService.findAndUpdateSuscriptionById(
        suscId,
        updateData
      );
    } catch (error) {
      throw error;
    }
  }

  @Delete("all")
  removeAllSuscriptions(
    @Query("planId") planId?: string,
    @Query("brandId") brandId?: string,
  ) {
    try {
      return this.suscService.removeAllSuscriptions(
        planId,
        brandId
      );
    } catch (error) {
      throw error;
    }
  }

  @Delete(":suscriptionId")
  removeSuscription(@Param("suscriptionId") suscId: string) {
    try {
      return this.suscService.removeSuscriptionById(suscId);
    } catch (error) {
      throw error;
    }
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateSuscripcioneDto: UpdateSuscripcioneDto) {
  //   return this.suscripcionesService.update(+id, updateSuscripcioneDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.suscripcionesService.remove(+id);
  // }
}
