import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Table extends Document {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  group!: string; // ör: Ön Taraf, Orta, Arka

  @Prop({ required: true, type: Types.ObjectId, ref: 'Restaurant', index: true })
  restaurant!: Types.ObjectId;

  @Prop({ default: 4 })
  capacity!: number;
}

export const TableSchema = SchemaFactory.createForClass(Table); 