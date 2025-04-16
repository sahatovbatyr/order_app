import { BaseCustomEntity } from '../common/ base/BaseCustomEntity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('payments')
export class Payment extends BaseCustomEntity {
  @Column({ nullable: false })
  date: Date;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ nullable: false })
  amount: number;
}
