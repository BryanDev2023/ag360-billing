import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BrandDocument = Brand & Document;

@Schema({ collection: 'brands' })
export class Brand extends Document {}

export const BrandSchema = SchemaFactory.createForClass(Brand);
