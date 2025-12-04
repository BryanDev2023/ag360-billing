import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { PlanStatus } from 'src/types/plan';

export interface Features {
  ai_agent: boolean;
  priority_support: boolean;
}

export type PlanDocument = Plan & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Plan extends Document  {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, type: Number })
  price: number;

  @Prop({
    required: true,
    type: String,
    enum: ['monthly', 'annual', 'quarter', 'semester'],
    default: "monthly"
  })
  duration: string;

  @Prop({ type: [String], default: [] })
  modules_included: string[];

  @Prop({ required: true, type: Number })
  order_limit: number;

  @Prop({ type: Object, required: true })
  features: Features;

  @Prop({ 
    type: String, 
    enum: ['active', 'inactive'], 
    default: 'active'
  })
  status: string;
}

export const PlanSchema = SchemaFactory.createForClass(Plan);