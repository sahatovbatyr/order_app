import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserUpdateEmailDto {
  // @ApiProperty({ example: 'my_username', description: 'Username' })
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'username', description: 'user name' })
  username!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'xyz', description: 'password' })
  password!: string;

  // @ApiProperty({ example: 'my_email@example.com', description: 'User email' })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ example: 'email@example.com', description: 'users email' })
  email!: string;
}
