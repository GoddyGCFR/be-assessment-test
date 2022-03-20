import { Injectable } from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Repository } from 'typeorm';
import { ExpenseEntity } from './entities/expense.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(ExpenseEntity)
    private readonly expensesRepository: Repository<ExpenseEntity>,
  ) {}

  async create(createExpenseDto: CreateExpenseDto) {
    const expense = await this.expensesRepository.create(createExpenseDto);
    await this.expensesRepository.save(expense);
    return { message: 'Expense created successfully' };
  }

  findAll() {
    return this.expensesRepository.find();
  }

  findOne(id: number) {
    return this.expensesRepository.findOne(id);
  }

  // async update(id: number, updateExpenseDto: UpdateExpenseDto) {
  //   const expense = await this.expensesRepository.find({ where: { id } });
  //
  //   if (!expense) return { message: 'This operation cannot be performed' };
  //
  //   const updatedExpense = {};
  //
  //   // Get keys of incoming update and put them in an array named keys
  //   const keys = Object.keys(updateExpenseDto);
  //   if (!keys.length) return { message: 'No data to update' };
  //
  //   keys.forEach((key) => {
  //     updatedExpense[key] = updateExpenseDto[key];
  //   });
  //
  //   await this.expensesRepository.update(id, updatedExpense);
  //
  //   return { message: 'Expense updated successfully' };
  // }

  remove(id: number) {
    return `This action removes a #${id} expense`;
  }
}
