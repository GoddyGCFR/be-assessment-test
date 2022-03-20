import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ExpenseEntity } from './entities/expense.entity';
import { AuthEntity } from '../auth/entities/auth.entity';

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

  async findAll(id, limit = 25, page = 1): Promise<Record<string, any>> {
    const filter = { user: id };
    const count = await this.expensesRepository.count({ where: filter });

    const paging = ExpensesService.pagination({ length: count, limit, page });

    const { skip, take, ...pagination } = paging;

    const expenses = await this.expensesRepository.find({
      where: filter,
      skip,
      take,
    });

    return { expenses, pagination };
  }

  async findOne(userId: string, id: string) {
    const expense = await this.expensesRepository.findOne({
      where: { id, user: userId },
    });

    if (!expense) throw new NotFoundException(`Expense not found`);

    return expense;
  }

  async update(userId: string, id: string, updateExpenseDto: UpdateExpenseDto) {
    const expense = await this.expensesRepository.find({
      where: { id, user: userId },
    });

    if (!expense) return { message: 'This operation cannot be performed' };

    const updatedExpense = {};

    // Get keys of incoming update and put them in an array named keys
    const keys = Object.keys(updateExpenseDto);
    if (!keys.length) return { message: 'No data to update' };

    keys.forEach((key) => {
      if (updatedExpense[key] && updatedExpense[key].length) {
        updatedExpense[key] = updateExpenseDto[key];
      }
    });

    await this.expensesRepository.update(id, updatedExpense);

    return { message: 'Expense updated successfully' };
  }

  async remove(userId: string, id: string) {
    const expense = await this.expensesRepository.findOne({
      where: { id, user: userId },
    });

    if (!expense)
      throw new NotFoundException(
        `Cannot delete an expense that does not exist`,
      );

    // if (expense.id.toString() !== userId.toString()) {
    //   throw new NotFoundException(
    //     `Operation cannot be performed. You are not the owner of this expense`,
    //   );
    // }

    return this.expensesRepository.delete(id);
  }

  // Helpers
  private static pagination({
    length,
    limit,
    page,
  }: {
    length?: number;
    limit?: number;
    page?: number;
  }) {
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    interface PagesI {
      prev?: { page?: number; limit?: number };
      next?: { page?: number; limit?: number };
    }
    const pages: PagesI = {};

    if (endIndex < length) {
      pages.next = { page: page + 1, limit };
    }

    if (startIndex > 0) {
      pages.prev = { page: page - 1, limit };
    }

    return { pages, skip: startIndex || 0, take: limit || 25 };
  }
}
