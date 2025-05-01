import { Injectable } from '@nestjs/common';
import { BaseCustomService } from '../../common/ base/BaseCustomService';
import { Role } from '../../entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { RoleEnum } from '../../enums/Role.enum';
import { CustomLoggerService } from '../logger/logger.service';

@Injectable()
export class RoleService extends BaseCustomService<Role> {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    logger: CustomLoggerService,
  ) {
    super(roleRepository, Role.name, logger);
  }

  protected getRelations(): string[] {
    return [];
  }

  async getRolesByIdList(roleIdList: number[]) {
    return await this.roleRepository.find({ where: { id: In(roleIdList) } });
  }

  async getRoleByTitle(role: RoleEnum) {
    return await super.findOneByProp_orThrow('title', role);
  }

  async seed() {
    for (const role of Object.values(RoleEnum)) {
      let candidate = await super.findOneByProp('title', role);
      if (!candidate) {
        candidate = new Role(role);
        super.create(candidate);
      }
    }
  }
}
