import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('expenses')
@UseGuards(AuthGuard('jwt'))
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  create(@Body() createExpenseDto: CreateExpenseDto, @Req() req?: Request) {
    const { id: userId } = req.user as unknown as { id: string };
    return this.expensesService.create(userId, createExpenseDto);
  }

  @Get()
  findAll(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Req() req: Request,
  ) {
    const { id: userId } = req.user as unknown as { id: string };
    return this.expensesService.findAll(userId, +limit, +page);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    const { id: userId } = req.user as unknown as { id: string };
    return this.expensesService.findOne(userId, id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
    @Req() req: Request,
  ) {
    const { id: userId } = req.user as unknown as { id: string };
    return this.expensesService.update(userId, id, updateExpenseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    const { id: userId } = req.user as unknown as { id: string };
    return this.expensesService.remove(userId, id);
  }
}
