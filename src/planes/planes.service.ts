import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';

import { InjectModel } from "@nestjs/mongoose";
import { DeleteResult, Model, Types } from "mongoose";
import { Plan, PlanDocument } from './entities/plan.entity';
import { DeletePlanResponse } from 'src/types/plan';

@Injectable()
export class PlanesService {
  constructor(@InjectModel(Plan.name) private planModel: Model<PlanDocument>) { }

  async createPlan(createPlaneDto: CreatePlanDto): Promise<Plan> {
    const createdPlan = new this.planModel(createPlaneDto);
    return createdPlan.save();
  }

  async findAllPlans(): Promise<Plan[]> {
    const foundPlanes = this.planModel.find().exec()
    if (!foundPlanes) {
      throw new NotFoundException({
        status: 404,
        message: "No se pudo encontrar ningun plan.",
        error: "Not found"
      });
    }
    return foundPlanes;
  }

  async findPlanById(planId: string): Promise<Plan> {
    if (!Types.ObjectId.isValid(planId)) {
      throw new NotFoundException({
        status: 404,
        message: `No se pudo encontrar el plan del id: ${planId}`,
        error: "Not found"
      });
    }

    const foundPlan = await this.planModel
      .findById(planId)
      .exec();

    if (!foundPlan) {
      throw new NotFoundException({
        status: 404,
        message: `No se pudo encontrar el plan del id: ${planId}`,
        error: "Not found"
      });
    }
    return foundPlan;
  }

  async findAndUpdateById(planId: string, updateData: UpdatePlanDto): Promise<Plan> {
    if (!Types.ObjectId.isValid(planId)) {
      throw new NotFoundException({
        status: 404,
        message: `No se pudo encontrar el plan del id '${planId}' y por ende no se puede actualizar...`,
        error: "Not found"
      });
    }

    const updatedPlan = await this.planModel
      .findByIdAndUpdate(
        planId,
        updateData,
        { new: true }
      )
      .exec();
    if (!updatedPlan) {
      throw new NotFoundException({
        status: 404,
        message: `No se pudo encontrar el plan del id '${planId}' y por ende no se puede actualizar...`,
        error: "Not found"
      });
    }
    return updatedPlan;
  }

  async removePlanById(planId: string): Promise<Plan> {
    if (!Types.ObjectId.isValid(planId)) {
      throw new NotFoundException({
        status: 404,
        message: `No se pudo encontrar el plan con id '${planId}' y por ende no se puede eliminar...`,
        error: "Not found"
      });
    }

    const removedPlan = await this.planModel
      .findByIdAndDelete(planId)
      .exec();

    if (!removedPlan) {
      throw new NotFoundException({
        status: 404,
        message: `No se pudo encontrar el plan con id '${planId}' y por ende no se puede eliminar...`,
        error: "Not found"
      });
    }
    return removedPlan;
  }

  async removeAllPlans(): Promise<DeletePlanResponse> {
    const { deletedCount } = await this.planModel.deleteMany().exec();
    
    if (deletedCount === 0) {
      const resultFailed: DeletePlanResponse = {
        success: false,
        message: "No se encontro ningun plan para eliminar",
        deletedCount
      }
      return resultFailed;
    }

    const resultSuccesfully: DeletePlanResponse = {
      success: true,
      message: "Se pudieron eliminar todos los planes exitosamente",
      deletedCount
    }
    return resultSuccesfully;
  }

  async removeManyPlansById(planIds: string[]): Promise<DeletePlanResponse> {
    console.log(planIds)
    if (!planIds || planIds.length === 0) {
      throw new BadRequestException({
        status: 400,
        message: "Debe proporcionar al menos un ID para eliminar.",
        error: "Bad Request"
      });
    }

    const { deletedCount } = await this.planModel
      .deleteMany({
        _id: {
          $in: planIds
        }
      })
      .exec();
    
    if (deletedCount === 0) {
      const resultFailed: DeletePlanResponse = {
        success: false,
        message: "No se encontro ningun plan para eliminar",
        deletedCount
      }
      return resultFailed;
    }

    const resultSuccesfully: DeletePlanResponse = {
      success: true,
      message: [
        "Se pudieron eliminar todos los planes exitosamente.",
        `Planes eliminados: ${planIds.join(", ")}`,
      ],
      deletedCount
    }
    return resultSuccesfully;
  }
}
