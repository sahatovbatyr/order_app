import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserLoginDto } from '../user/dto/UserLoginDto';
import { UserCreateDto } from '../user/dto/UserCreateDto';
import { TokenDto } from './dto/TokenDto';
import { User } from '../../entities/user.entity';
import { JwtPayload } from './dto/JwtPayload';
import { Request } from 'express';
import { MessageDto } from '../../common/dto/MessageDto';
import { CustomLoggerService } from '../logger/logger.service';
import { ILogMeta } from '../../interfaces/ILogMeta';

@Injectable()
export class AuthService {
  // private logger: CustomLoggerService;
  private logMeta: ILogMeta;
  constructor(
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    private jwtService: JwtService,
    private readonly logger: CustomLoggerService,
  ) {
    this.logMeta = { context: AuthService.name };
  }

  async login(userDto: UserLoginDto) {
    // this.logger.info('Attempt logging', { context: this.logger.getContext() });
    const user = await this.verifyUser(userDto);

    if (!user.is_active) {
      throw new ForbiddenException('Email not verified');
    }
    return this.generateToken(user);
  }

  async registration(userDto: UserCreateDto): Promise<MessageDto> {
    if (!userDto.username) {
      userDto.username = userDto.email;
    }

    const candidate = await this.userService.findByUsername(userDto.username);

    if (candidate) {
      throw new BadRequestException(
        `Username: ${userDto.username} already exists.`,
      );
    }

    await this.userService.create(userDto);

    // return await this.generateToken(user);
    return new MessageDto('User succesfully created');
  }

  private async generateToken(user: User): Promise<TokenDto> {
    const token = this.jwtService.sign({
      userId: user.id,
      username: user.username,
      roles: user.roles,
    });

    return new TokenDto(token);
  }

  public getPayload(request: Request): JwtPayload {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      this.logger.log('Authorization header missing', this.logMeta);
      throw new BadRequestException('Authorization header missing');
    }

    const bearer = authHeader.split(' ')[0];
    const token = authHeader.split(' ')[1];

    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid authorization header format.');
    }

    try {
      const payload = this.jwtService.verify(token) as JwtPayload;
      return payload;
    } catch (err) {
      if (err instanceof Error) {
        throw new UnauthorizedException(
          `Unautorized user. Token verification failed: ${err.message}`,
        );
      }
      throw new UnauthorizedException(
        `Unautorized user. Token verification failed`,
      );
    }
  }

  private async verifyUser(userDto: UserLoginDto): Promise<User> {
    let user: User;

    if (userDto.username) {
      user = await this.userService.findByUsername_orThrow_onLogging(
        userDto.username,
      );
    } else if (userDto.email) {
      user = await this.userService.findByEmail_orThrow(userDto.email);
    } else {
      throw new BadRequestException('Enter username or email to login.');
    }

    const hashed = user.password;

    const isValid = await this.userService.isPasswordValid(
      userDto.password,
      hashed,
    );

    if (!user || !isValid) {
      this.logger.warn(
        `Wrong username or password on logging. username:${userDto.username}`,
        this.logMeta,
      );
      throw new UnauthorizedException('Error. User or password not match.');
    }

    return user;
  }
}
