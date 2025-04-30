import { PrimaryGeneratedColumn } from 'typeorm';

export abstract class BaseCustomEntity {
  @PrimaryGeneratedColumn()
  id: number;
}
