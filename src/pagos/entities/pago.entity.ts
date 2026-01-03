import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from 'mongoose';

export type PagosDocument = Pago & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Pago extends Document {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: true,
    name: "brand_id",
    ref: "Brand"
  })
  brandId: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: true,
    name: "suscription_id"
  })
  suscriptionId: string;

  @Prop({
    type: String,
    enum: ["transferencia", "billetera_digital", "pago_link"],
    required: true,
  })
  tipo_pago: string;

  @Prop({ type: String })
  transferencia: string;

  @Prop({ type: String })
  billetera_digital: string;

  @Prop({ type: String })
  pago_link: string;

  @Prop({ type: String })
  voucher_pago: string;

  @Prop({ type: [String] })
  notas: string[]

  @Prop({
    type: String,
    enum: ["completado", "cancelado", "pendiente"],
    default: "pendiente",
    required: true
  })
  status: string;

  @Prop({ type: Date, required: true })
  fecha_pago: Date;
}

export const PagoSchema = SchemaFactory.createForClass(Pago);
