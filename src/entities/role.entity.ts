import { Column, Entity } from 'typeorm';
import { RoleEnum } from '../enums/Role.enum';
import { BaseCustomEntity } from '../common/ base/BaseCustomEntity';

@Entity('roles')
export class Role extends BaseCustomEntity {
  @Column({
    type: 'enum',
    nullable: false,
    unique: true,
    enum: RoleEnum,
    default: RoleEnum.USER,
  })
  title!: string;
}
