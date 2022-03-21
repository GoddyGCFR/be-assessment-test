import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { UserEntity } from '../../users/entities/user.entity';

export class CreateExpenseDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  user: UserEntity;
}
