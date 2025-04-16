import { BaseCustomEntity } from '../common/ base/BaseCustomEntity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('orders')
export class Order extends BaseCustomEntity {
  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ nullable: false })
  order_date: Date;

  @Column({ nullable: false })
  note: string;

  @Column({ nullable: false })
  amount: number;
}
