import { Test, TestingModule } from '@nestjs/testing';
import { ExpensesController } from './expenses.controller';
import { ExpensesService } from './expenses.service';
import { AuthEntity } from '../auth/entities/auth.entity';

describe('ExpensesController', () => {
  let controller: ExpensesController;

  const mockExpensesService = {
    // get: jest.fn(() => {}),
    // getExpense: jest.fn(() => {}),
    create: jest.fn(() => {
      return { message: 'Expense created successfully' };
    }),
    // updateExpense: jest.fn(() => {}),
    // deleteExpense: jest.fn(() => {}),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExpensesController],
      providers: [ExpensesService],
    })
      .overrideProvider(ExpensesService)
      .useValue(mockExpensesService)
      .compile();

    controller = module.get<ExpensesController>(ExpensesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a new expense', () => {
    expect(
      controller.create(
        {
          amount: 1111,
          name: 'Soft Drinks',
          description: 'Soft mineral drinks',
          user: 'cc37cf50-18f3-4ef9-bed7-13ec2b8e056e' as unknown as AuthEntity,
        },
        // @ts-ignore
        { user: { id: 'cc37cf50-18f3-4ef9-bed7-13ec2b8e056e' } },
      ),
    ).toMatchObject({ message: 'Expense created successfully' });
  });
});
