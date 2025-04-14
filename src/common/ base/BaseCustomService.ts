import { Repository, FindOptionsWhere, DeepPartial } from 'typeorm';
import { BaseCustomEntity } from './BaseCustomEntity';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

export abstract class BaseCustomService<T extends BaseCustomEntity> {
  constructor(
    protected readonly repository: Repository<T>,
    private readonly entityName: string,
  ) {}

  protected abstract getRelations(): string[];

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

  public async findOneByProp(
    propName: keyof T,
    propValue: any,
  ): Promise<T | null> {
    return await this.repository.findOne({
      where: { [propName]: propValue },
      relations: this.getRelations(),
    } as any);
  }

  public async findOneByProp_orThrow(
    propName: keyof T,
    propValue: any,
  ): Promise<T> {
    const res = await this.findOneByProp(propName, propValue);

    if (!res) {
      throw new NotFoundException(
        `Entity [${this.entityName}] not found ( ${String(propName)}: ${propValue})`,
      );
    }

    return res;
  }

  async create(entity: DeepPartial<T>): Promise<T> {
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

  protected async save(entity: DeepPartial<T>) {
    try {
      return await this.repository.save(entity);
    } catch (err: any) {
      throw new InternalServerErrorException(`Error in server. ${err.message}`);
    }
  }
}
