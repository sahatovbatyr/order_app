import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserLoginDto } from '../user/dto/UserLoginDto';
import { UserCreateDto } from '../user/dto/UserCreateDto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/hello')
  async hello() {
    return 'Hello Auth';
  }

  @Post('/login')
  async login(@Body() userDto: UserLoginDto) {
    return await this.authService.login(userDto);
  }

  @Post('/registration')
  async registration(@Body() userDto: UserCreateDto) {
    return this.authService.registration(userDto);
  }
}
