import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order } from './order.schema';

@Injectable()
export class OrdersService {
  constructor(@InjectModel(Order.name) private orderModel: Model<Order>) {}

  async findActiveByTable(tableId: string): Promise<Order | null> {
    return this.orderModel.findOne({ table: tableId, status: 'active' }).exec();
  }

  async create(data: Partial<Order>): Promise<Order> {
    return this.orderModel.create(data);
  }

  async update(id: string, data: Partial<Order>): Promise<Order | null> {
    return this.orderModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async findByTable(tableId: string): Promise<Order[]> {
    return this.orderModel.find({ table: tableId }).sort({ createdAt: -1 }).exec();
  }
} 