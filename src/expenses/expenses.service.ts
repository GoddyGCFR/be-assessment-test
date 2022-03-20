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

  async findAll(limit = 25, page = 1): Promise<Record<string, any>> {
    const count = await this.expensesRepository.count();
    const paging = ExpensesService.pagination({
      length: count,
      limit,
      page,
    });

    const { skip, take } = paging;

    const expenses = await this.expensesRepository.find({ skip, take });

    return { expenses, paging };
  }

  findOne(id: string) {
    return this.expensesRepository.findOne(id);
  }

  async update(id: string, updateExpenseDto: UpdateExpenseDto) {
    const expense = await this.expensesRepository.find({ where: { id } });

    if (!expense) return { message: 'This operation cannot be performed' };

    const updatedExpense = {};

    // Get keys of incoming update and put them in an array named keys
    const keys = Object.keys(updateExpenseDto);
    if (!keys.length) return { message: 'No data to update' };

    keys.forEach((key) => {
      updatedExpense[key] = updateExpenseDto[key];
    });

    await this.expensesRepository.update(id, updatedExpense);

    return { message: 'Expense updated successfully' };
  }

  remove(id: string) {
    return `This action removes a #${id} expense`;
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

    return { pages, skip: startIndex || 0, take: limit };
  }
}
