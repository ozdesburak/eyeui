import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get('active')
  async findActiveByTable(@Query('tableId') tableId: string) {
    return this.ordersService.findActiveByTable(tableId);
  }

  @Post()
  async create(@Body() body) {
    return this.ordersService.create(body);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body) {
    return this.ordersService.update(id, body);
  }

  @Get('by-table/:tableId')
  async findByTable(@Param('tableId') tableId: string) {
    return this.ordersService.findByTable(tableId);
  }
} 