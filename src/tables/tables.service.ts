import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Table } from './table.schema';

@Injectable()
export class TablesService {
  constructor(@InjectModel(Table.name) private tableModel: Model<Table>) {}

  async findAll(restaurantId: string): Promise<Table[]> {
    return this.tableModel.find({ restaurant: restaurantId }).exec();
  }

  async findById(id: string): Promise<Table | null> {
    return this.tableModel.findById(id).exec();
  }

  async create(data: Partial<Table> & { restaurant: string }): Promise<Table> {
    return this.tableModel.create(data);
  }

  async update(id: string, data: Partial<Table>): Promise<Table | null> {
    return this.tableModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async delete(id: string): Promise<Table | null> {
    return this.tableModel.findByIdAndDelete(id).exec();
  }

  async seedDefaultTables(restaurantId: string): Promise<Table[]> {
    const groups = ['Ön Taraf', 'Orta', 'Arka'];
    const tables: Partial<Table>[] = [];
    for (let i = 1; i <= 20; i++) {
      tables.push({
        name: `Masa ${i}`,
        group: groups[Math.floor((i - 1) / 7)],
        restaurant: new Types.ObjectId(restaurantId),
        capacity: 4 + (i % 3) // 4, 5, 6 kişilik masalar
      });
    }
    return this.tableModel.insertMany(tables);
  }
} 