import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';

import { InjectModel } from "@nestjs/mongoose";
import { DeleteResult, Model } from "mongoose";
import { Plan, PlanDocument } from './entities/plan.entity';

@Injectable()
export class PlanesService {
  constructor(@InjectModel(Plan.name) private planModel: Model<PlanDocument>) {}

  async create(createPlaneDto: CreatePlanDto): Promise<Plan> {
    try {
      const createdPlan = new this.planModel(createPlaneDto);
      return createdPlan.save();
    } catch (error) {
      throw error;
    }
  }

  async findAll(): Promise<Plan[]> {
    try {
      const foundPlanes = this.planModel.find().exec()
      if (!foundPlanes) {
        throw new NotFoundException({
          status: 404,
          message: "No se pudo encontrar ningun plan.",
          error: "Not found"
        });
      }
      return foundPlanes;
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string): Promise<Plan> {
    try {
      const foundPlan = await this.planModel.findById(id).exec();
      if (!foundPlan) {
        throw new NotFoundException({
          status: 404,
          message: `No se pudo encontrar el plan del id: ${id}`,
          error: "Not found"
        });
      }
      return foundPlan;
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, updatePlaneDto: UpdatePlanDto): Promise<Plan> {
    try {
      const updatedPlan = await this.planModel
        .findByIdAndUpdate(id, updatePlaneDto, { new: true })
        .exec();
      if (!updatedPlan) {
        throw new NotFoundException({
          status: 404,
          message: `No se pudo encontrar el plan del id '${id}' y por ende no se puede actualizar...`,
          error: "Not found"
        });
      }
      return updatedPlan;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string): Promise<Plan> {
    try {
      const removedPlan = await this.planModel.findByIdAndDelete(id).exec();
      if (!removedPlan) {
        throw new NotFoundException({
          status: 404,
          message: `No se pudo encontrar el plan del id '${id}' y por ende no se puede eliminar...`,
          error: "Not found"
        });
      }
      return removedPlan;
    } catch (error) {
      throw error;
    }
  }

  async removeAll(): Promise<DeleteResult> {
    try {
      const deleteResult = await this.planModel.deleteMany().exec();
      return deleteResult;
    } catch (error) {
      throw error;
    }
  }

  async removeMany(ids: string[]): Promise<DeleteResult> {
    try {
      if (!ids || ids.length === 0) {
        throw new BadRequestException({
          status: 400,
          message: "Debe proporcionar al menos un ID para eliminar.",
          error: "Bad Request"
        });
      }
      const deleteResult = await this.planModel.deleteMany({ _id: { $in: ids } }).exec();
      return deleteResult;
    } catch (error) {
      throw error;
    }
  }
}
