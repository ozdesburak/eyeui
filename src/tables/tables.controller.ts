import { Controller, Get, Post, Put, Delete, Body, Param, Req, UseGuards } from '@nestjs/common';
import { TablesService } from './tables.service';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('tables')
// @UseGuards(JwtAuthGuard)
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @Get()
  async findAll(@Req() req) {
    // const restaurantId = req.user.restaurant; // JWT'den alınacak
    const restaurantId = req.query.restaurantId; // Geçici
    return this.tablesService.findAll(restaurantId);
  }

  @Post()
  async create(@Body() body, @Req() req) {
    // const restaurantId = req.user.restaurant;
    const restaurantId = body.restaurantId; // Geçici
    return this.tablesService.create({ ...body, restaurant: restaurantId });
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body) {
    return this.tablesService.update(id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.tablesService.delete(id);
  }

  @Post('seed')
  async seed(@Body('restaurantId') restaurantId: string) {
    return this.tablesService.seedDefaultTables(restaurantId);
  }
} 