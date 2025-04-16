import { Role } from './role.entity';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { BaseCustomEntity } from '../common/ base/BaseCustomEntity';

@Entity('users')
export class User extends BaseCustomEntity {
  @Column({ type: 'varchar', unique: true, nullable: false })
  username!: string;

  @Column({ type: 'varchar', unique: true, nullable: false })
  email!: string;

  @Column({ type: 'varchar', nullable: false })
  is_active: boolean;

  @ManyToMany(() => Role)
  @JoinTable({
    name: 'users_roles',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
  })
  roles!: Role[];
}
