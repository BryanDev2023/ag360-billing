import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PlanesService } from './planes.service';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { CreatePlanDto } from './dto/create-plan.dto';
import { DeletePlanDto } from './dto/delete-plan-dto';

@Controller('planes')
export class PlanesController {
  constructor(private readonly planesService: PlanesService) {}

  @Post()
  create(@Body() createPlaneDto: CreatePlanDto) {
    return this.planesService.create(createPlaneDto);
  }

  @Get()
  findAll() {
    return this.planesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.planesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlaneDto: UpdatePlanDto) {
    return this.planesService.update(id, updatePlaneDto);
  }

  @Delete("all")
  removeAll() {
    return this.planesService.removeAll();
  }

  @Delete('delete')
  removeMany(@Body() body: DeletePlanDto) {
    return this.planesService.removeMany(body.ids);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.planesService.remove(id);
  }
}
