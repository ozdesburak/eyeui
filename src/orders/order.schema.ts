import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Table', required: true, index: true })
  table!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Restaurant', required: true, index: true })
  restaurant!: Types.ObjectId;

  @Prop({ default: 'active' })
  status!: 'active' | 'completed' | 'cancelled';

  @Prop({ type: [{ productId: String, name: String, qty: Number, price: Number }] })
  items!: any[];

  @Prop()
  total!: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order); 