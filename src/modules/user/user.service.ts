import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseCustomService } from '../../common/ base/BaseCustomService';
import { User } from '../../entities/user.entity';
import { DbTable } from '../../enums/DbTable';
import { UserCreateDto } from './dto/UserCreateDto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleService } from '../role/role.service';
import { RoleEnum } from '../../enums/Role.enum';

@Injectable()
export class UserService extends BaseCustomService<User> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly roleService: RoleService,
  ) {
    super(userRepository, User.name);
  }

  protected getRelations(): string[] {
    return [DbTable.ROLES];
  }

  public async create(userDto: UserCreateDto): Promise<User> {
    if (userDto.password != userDto.password_confirmation) {
      throw new BadRequestException(`Error. Passwords NOT match!`);
    }

    const dbUser: User | null = await super.findOneByProp(
      'username',
      userDto.username,
    );
    if (dbUser) {
      throw new BadRequestException(
        `Error. username: ${userDto.username} already exists.`,
      );
    }

    if (userDto.email && (await super.findOneByProp('email', userDto.email))) {
      throw new BadRequestException(
        `Error. user with email: ${userDto.email} already exists.`,
      );
    }

    const saltOrRounds = 10;
    const hash = await bcrypt.hash(userDto.password, saltOrRounds);
    userDto.password = hash;

    userDto.roles = [
      await this.roleService.findOneByProp_orThrow('title', RoleEnum.USER),
    ];
    return await super.create(userDto);
  }

  async findByUsername(username: string): Promise<User | null> {
    return await super.findOneByProp('username', username);
  }

  async findByUsername_orThrow(username: string): Promise<User> {
    return super.findOneByProp_orThrow('username', username);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await super.findOneByProp('email', email);
  }

  async findByEmail_orThrow(email: string): Promise<User> {
    return super.findOneByProp_orThrow('email', email);
  }
}
