import { Repository, FindOptionsWhere } from 'typeorm';
import { BaseCustomEntity } from './BaseCustomEntity';
import { NotFoundException } from '@nestjs/common';

export abstract class BaseCustomService<T extends BaseCustomEntity> {
  constructor(protected readonly repository: Repository<T>) {}

  async findById(id: number): Promise<T | null> {
    return this.repository.findOneBy({ id } as FindOptionsWhere<T>);
  }

  async findByIdOrThrow(id: number): Promise<T> {
    const entity = await this.findById(id);
    if (!entity) {
      throw new NotFoundException(`Entity with ID ${id} not found`);
    }
    return entity;
  }

  async create(entity: Partial<T>): Promise<T> {
    const newEntity = this.repository.create(entity);
    return this.repository.save(newEntity);
  }

  async update(id: number, entity: Partial<T>): Promise<T> {
    const existingEntity = await this.findByIdOrThrow(id);
    Object.assign(existingEntity, entity);
    return this.repository.save(existingEntity);
  }

  async delete(id: number): Promise<void> {
    const entity = await this.findByIdOrThrow(id);
    await this.repository.remove(entity);
  }

  async find(): Promise<T[]> {
    return this.repository.find();
  }
}