import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { BaseCustomService } from '../../common/ base/BaseCustomService';
import { User } from '../../entities/user.entity';
import { DbTable } from '../../enums/DbTable';
import { UserCreateDto } from './dto/UserCreateDto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleService } from '../role/role.service';
import { RoleEnum } from '../../enums/Role.enum';
import { UserUpdateRolesDto } from './dto/UserUpdateRolesDto';
import { UserUpdatePasswordDto } from './dto/UserUpdatePasswordDto';
import { UserUpdateEmailDto } from './dto/UserUpdateEmailDto';
import { EmailService } from '../email/email.service';
import { CustomLoggerService } from '../logger/logger.service';

@Injectable()
export class UserService extends BaseCustomService<User> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly roleService: RoleService,
    @Inject(forwardRef(() => EmailService))
    private readonly emailService: EmailService,
    logger: CustomLoggerService,
  ) {
    super(userRepository, User.name, logger);
  }

  protected getRelations(): string[] {
    return [DbTable.ROLES];
  }

  public async create(userDto: UserCreateDto): Promise<User> {
    this.logger.log(
      `New user creating attempt: ${userDto.username}`,
      this.logMeta,
    );
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

    const newUser = new User();
    newUser.is_active = false;
    newUser.password = hash;
    newUser.username = userDto.username;
    newUser.email = userDto.email;
    newUser.roles = [
      await this.roleService.findOneByProp_orThrow('title', RoleEnum.USER),
    ];

    return await super.create(newUser);
  }

  async findByUsername(username: string): Promise<User | null> {
    return await super.findOneByProp('username', username);
  }

  async findByUsername_orThrow(username: string): Promise<User> {
    return super.findOneByProp_orThrow('username', username);
  }

  async findByUsername_onLogging(username: string): Promise<User | null> {
    const user = await this.findByUsername(username);
    if (!user) {
      this.logger.warn(`Wrong username: ${username} on Logging!`, this.logMeta);
    }
    return user;
  }

  async findByUsername_orThrow_onLogging(username: string): Promise<User> {
    const user = await this.findByUsername_onLogging(username);
    if (!user) {
      throw new UnauthorizedException(`Wrong username or password`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return await super.findOneByProp('email', email);
  }

  async findByEmail_orThrow(email: string): Promise<User> {
    return super.findOneByProp_orThrow('email', email);
  }

  async updateRoles(userDto: Readonly<UserUpdateRolesDto>): Promise<User> {
    if (userDto.roleIdList.length == 0) {
      this.logger.warn(`Incorrect roles list sended: ${userDto.roleIdList}`);
      throw new BadRequestException('Specify the users roles!');
    }

    const user = await super.findById_orThrow(userDto.id);
    const roles = await this.roleService.getRolesByIdList(userDto.roleIdList);

    if (roles.length != userDto.roleIdList.length) {
      this.logger.warn(`Incorrect roles sended: ${userDto.roleIdList}`);
      throw new BadRequestException('Incorrect roles.');
    }

    user.roles = roles;
    const res = await this.userRepository.save(user);
    this.logger.log(` User id:${userDto.id} roles updated`);

    return res;
  }

  async seed() {
    const admin = await super.findOneByProp('username', 'admin');
    if (!admin) {
      const newInitUser = new User();
      newInitUser.username = 'admin';
      newInitUser.email = 'admin@example.com';
      newInitUser.is_active = false;
      const saltOrRounds = 10;
      newInitUser.password = await bcrypt.hash('admin', saltOrRounds);
      newInitUser.roles = [
        await this.roleService.getRoleByTitle(RoleEnum.ADMIN),
      ];

      await this.userRepository.save(newInitUser);
    }
  }

  async isPasswordValid(unhashedPassword: string, hashedPassword: string) {
    return await bcrypt.compare(unhashedPassword, hashedPassword);
  }

  async isPasswordValid_orThrow(
    unhashedPassword: string,
    hashedPassword: string,
  ) {
    const isValid = await bcrypt.compare(unhashedPassword, hashedPassword);

    if (!isValid) {
      throw new UnauthorizedException('User login or password not match.');
    }
    return isValid;
  }

  async updatePassword(userId: number, userDto: UserUpdatePasswordDto) {
    this.logger.warn(`Password change initiated for user:${userDto.username}`);
    if (userDto.newPassword != userDto.newPasswordConfirmation) {
      throw new BadRequestException('new Password and confirmation not match.');
    }

    const user = await this.findById_orThrow(userId);

    if (userId != userDto.id || user.username != userDto.username) {
      throw new UnauthorizedException(
        'Access Denied. The password can be changed only by the owner.',
      );
    }

    await this.isPasswordValid_orThrow(userDto.oldPassword, user.password);

    user.password = await bcrypt.hash(userDto.newPassword, 10);
    await this.save(user);
    this.logger.log(`Password successfully changed for user: ${user.username}`);
    return;
  }

  async updateEmail(
    userDto: Readonly<UserUpdateEmailDto>,
    author: string,
  ): Promise<User> {
    if (author !== userDto.username) {
      throw new ForbiddenException(
        'Access Denied. The email can be changed only by the owner.',
      );
    }

    const user = await this.findByUsername_orThrow(userDto.username);
    if (!(await this.isPasswordValid(userDto.password, user.password))) {
      this.logger.warn(
        `Wrong password on logging. username:${userDto.username}`,
        this.logMeta,
      );
      throw new UnauthorizedException('User login or password not match.');
    }
    const userByEmail = await this.findByEmail(userDto.email);

    if (userByEmail) {
      throw new BadRequestException(`Email ${userDto.email} already exists.`);
    }
    user.email = userDto.email;
    const res = await this.save(user);
    this.logger.log(
      `Email changed from ${user.email} to ${userDto.email} by ${author}`,
    );
    return res;
  }

  async activateEmail(token: string): Promise<User> {
    this.logger.log(`Email activation attempt with token`);
    const payload = this.emailService.getPayload(token);
    const username = payload.username;

    const user = await this.findByUsername_orThrow(username);
    user.is_active = true;
    const res = await this.save(user);
    this.logger.log(`Email activated for user ${username}`);
    return res;
  }
}
