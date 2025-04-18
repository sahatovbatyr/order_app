import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { UserCreateDto } from './dto/UserCreateDto';
import { UserResponseDto } from './dto/UserResponseDto';
import { plainToInstance } from 'class-transformer';
import { ReqParamParseIntPipe } from '../../common/pipes/ReqParamParseIntPipe';
import { User } from '../../entities/user.entity';
import { UserUpdateRolesDto } from './dto/UserUpdateRolesDto';
import { MessageDto } from '../../common/dto/MessageDto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

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

  @Get('get-by-id/:id')
  async getById(
    @Param('id', ReqParamParseIntPipe) id: number,
  ): Promise<UserResponseDto> {
    const user = await this.userService.findById_orThrow(id);
    return plainToInstance(UserResponseDto, user);
  }

  @Get('/get-all')
  async findAll(): Promise<UserResponseDto[]> {
    const users: User[] = await this.userService.findAll();
    return plainToInstance(UserResponseDto, users, {
      excludeExtraneousValues: true,
    });
  }

  @Post('/update-roles')
  async updateRoles(@Body() userDto: UserUpdateRolesDto): Promise<MessageDto> {
    await this.userService.updateRoles(userDto);
    // this.logger.log('userTemp ', userTemp);
    return new MessageDto('Role succesfully updated');
  }

  // @Post('/update-password')
  // async updatePassword(
  //   @Body() userDto: UserUpdatePasswordDto,
  //   @Req() req: any,
  // ): Promise<MessageDto> {
  //   const payload = this.authService.getPayload(req);
  //   await this.userService.updatePassword(payload.userId, userDto);
  //   return new MessageDto('Password succesfully updated!');
  // }
}
