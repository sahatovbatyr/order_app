import {
  Body,
  Controller,
  forwardRef,
  Get,
  Inject,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserCreateDto } from './dto/UserCreateDto';
import { UserResponseDto } from './dto/UserResponseDto';
import { plainToInstance } from 'class-transformer';
import { ReqParamParseIntPipe } from '../../common/pipes/ReqParamParseIntPipe';
import { User } from '../../entities/user.entity';
import { UserUpdateRolesDto } from './dto/UserUpdateRolesDto';
import { MessageDto } from '../../common/dto/MessageDto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../common/guards/AuthGuard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/RolesGuard';
import { RoleEnum } from '../../enums/Role.enum';
import { UserUpdatePasswordDto } from './dto/UserUpdatePasswordDto';
import { AuthService } from '../auth/auth.service';
import { UserUpdateEmailDto } from './dto/UserUpdateEmailDto';
import { EmailService } from '../email/email.service';

@ApiTags('USER')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    @Inject(forwardRef(() => EmailService))
    private readonly emailService: EmailService,
  ) {}

  @Get('hello')
  getHello() {
    return 'Hello User';
  }

  @Post('create')
  async create(@Body() userDto: UserCreateDto): Promise<UserResponseDto> {
    const user = this.userService.create(userDto);
    const userRes = plainToInstance(UserResponseDto, user);
    return userRes;
  }

  @ApiOperation({ summary: 'Get User by id' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  @UseGuards(AuthGuard)
  @Get('get-by-id/:id')
  async getById(
    @Param('id', ReqParamParseIntPipe) id: number,
  ): Promise<UserResponseDto> {
    const user = await this.userService.findById_orThrow(id);
    return plainToInstance(UserResponseDto, user);
  }

  @ApiOperation({ summary: 'Get All users' })
  @ApiResponse({ status: 200, type: [UserResponseDto] })
  @Get('/get-all')
  async findAll(): Promise<UserResponseDto[]> {
    const users: User[] = await this.userService.findAll();
    return plainToInstance(UserResponseDto, users, {
      excludeExtraneousValues: true,
    });
  }

  @ApiOperation({ summary: 'Update Users role' })
  @ApiResponse({ status: 200, type: MessageDto })
  @Roles(RoleEnum.ADMIN)
  @UseGuards(RolesGuard)
  @Post('/update-roles')
  async updateRoles(@Body() userDto: UserUpdateRolesDto): Promise<MessageDto> {
    await this.userService.updateRoles(userDto);
    // this.logger.log('userTemp ', userTemp);
    return new MessageDto('Role succesfully updated');
  }

  @ApiOperation({ summary: 'Update Users role' })
  @ApiResponse({ status: 200, type: MessageDto })
  @UseGuards(AuthGuard)
  @Post('/update-password')
  async updatePassword(
    @Body() userDto: UserUpdatePasswordDto,
    @Req() req: any,
  ): Promise<MessageDto> {
    const payload = this.authService.getPayload(req);
    await this.userService.updatePassword(payload.userId, userDto);
    return new MessageDto('Password succesfully updated!');
  }

  @ApiOperation({ summary: 'Update Users email' })
  @ApiResponse({ status: 200, type: MessageDto })
  @Post('/update-email')
  async updateUserEmail(
    @Body() userDto: UserUpdateEmailDto,
  ): Promise<MessageDto> {
    await this.userService.updateEmail(userDto, userDto.username);
    return new MessageDto('Email succesfully updated!');
  }

  @ApiOperation({ summary: 'Users email activate' })
  @ApiResponse({ status: 200, type: MessageDto })
  @Get('email-activate/:token')
  async emailActivate(@Param('token') token: string) {
    await this.userService.activateEmail(token);
    return new MessageDto(`Email succesfully activated.`);
  }
}
