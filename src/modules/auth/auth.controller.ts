import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserLoginDto } from '../user/dto/UserLoginDto';
import { UserCreateDto } from '../user/dto/UserCreateDto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MessageDto } from '../../common/dto/MessageDto';
import { TokenDto } from './dto/TokenDto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Get hello text. Testing' })
  @ApiResponse({ status: 200 })
  @Get('/hello')
  async hello() {
    return 'Hello Auth';
  }

  @ApiOperation({ summary: 'Users login' })
  @ApiResponse({ status: 200, type: TokenDto })
  @Post('/login')
  async login(@Body() userDto: UserLoginDto): Promise<TokenDto> {
    return await this.authService.login(userDto);
  }

  @ApiOperation({ summary: 'New User registration.' })
  @ApiResponse({ status: 201, type: MessageDto })
  @Post('/registration')
  async registration(@Body() userDto: UserCreateDto): Promise<MessageDto> {
    return await this.authService.registration(userDto);
  }
}
