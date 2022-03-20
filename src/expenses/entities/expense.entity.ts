import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AuthEntity } from '../../auth/entities/auth.entity';

@Entity('expenses')
export class ExpenseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column()
  description: string;

  @Column('decimal', { nullable: false })
  amount: number;

  @ManyToOne((type) => AuthEntity, (user) => user.expenses, {
    nullable: false,
  })
  // @JoinTable()
  user: AuthEntity;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
