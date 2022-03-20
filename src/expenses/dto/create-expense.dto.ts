import { AuthEntity } from '../../auth/entities/auth.entity';
import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

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

  @IsUUID()
  @IsNotEmpty()
  user: AuthEntity;
}
