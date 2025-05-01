import { Repository, FindOptionsWhere, DeepPartial } from 'typeorm';
import { BaseCustomEntity } from './BaseCustomEntity';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CustomLoggerService } from '../../modules/logger/logger.service';
import { ILogMeta } from '../../interfaces/ILogMeta';

export abstract class BaseCustomService<T extends BaseCustomEntity> {
  protected logMeta: ILogMeta;
  constructor(
    protected readonly repository: Repository<T>,
    private readonly entityName: string,
    protected readonly logger: CustomLoggerService,
  ) {
    this.logMeta = { context: this.constructor.name };
  }

  protected abstract getRelations(): string[];

  async findById(id: number): Promise<T | null> {
    const res = this.repository.findOneBy({ id } as FindOptionsWhere<T>);
    if (!res) {
      this.logger.log(
        `Entity:${this.entityName} with ID ${id} not found.`,
        this.logMeta,
      );
    }
    return res;
  }

  async findById_orThrow(id: number): Promise<T> {
    const entity = await this.findById(id);
    if (!entity) {
      this.logger.log(
        `Entity:${this.entityName} with ID ${id} not found.`,
        this.logMeta,
      );
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
    const existingEntity = await this.findById_orThrow(id);
    Object.assign(existingEntity, entity);
    return this.repository.save(existingEntity);
  }

  async delete(id: number): Promise<void> {
    const entity = await this.findById_orThrow(id);
    await this.repository.remove(entity);
  }

  async findAll(): Promise<T[]> {
    return this.repository.find();
  }

  protected async save(entity: DeepPartial<T>) {
    try {
      const result = await this.repository.save(entity);
      return result;
    } catch (err: any) {
      this.logger.error(
        `Error on saving ${this.entityName}`,
        err,
        this.logMeta,
      );
      throw new InternalServerErrorException(`Error in server. ${err.message}`);
    }
  }
}
