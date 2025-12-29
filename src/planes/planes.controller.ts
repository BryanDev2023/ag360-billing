import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PlanesService } from './planes.service';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { CreatePlanDto } from './dto/create-plan.dto';
import { DeletePlanDto } from './dto/delete-plan-dto';

@Controller('planes')
export class PlanesController {
  constructor(private readonly planesService: PlanesService) {}

  @Post()
  createNewPlan(@Body() createData: CreatePlanDto) {
    try {
      const createdPlan = this.planesService.createPlan(createData);
      return createdPlan;
    } catch (error) {
      throw error;
    }
  }

  @Get()
  findAllPlans() {
    try {
      return this.planesService.findAllPlans();
    } catch (error) {
      throw error;
    }
  }

  @Get(':planId')
  findPlan(@Param('planId') id: string) {
    try {
      return this.planesService.findPlanById(id);
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id')
  updatePlan(
    @Param('id') id: string,
    @Body() updatePlaneDto: UpdatePlanDto
  ) {
    try {
      return this.planesService.findAndUpdateById(id, updatePlaneDto);
    } catch (error) {
      throw error;
    }
  }

  @Delete("all")
  removeAllPlans() {
    try {
      return this.planesService.removeAllPlans();
    } catch (error) {
      throw error;
    }
  }

  @Delete("deleteMany")
  removeManyPlans(@Body() planIds: string[]) {
    try {
      return this.planesService.removeManyPlansById(planIds);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':planId')
  removePlan(@Param('planId') planId: string) {
    try {
      return this.planesService.removePlanById(planId);
    } catch (error) {
      throw error;
    }
  }
}
