import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserEmailVerificationDto {
  // @IsNotEmpty()
  // @IsInt()
  // @ApiProperty({ example: 'username', description: 'User name' })
  // id!: number;

  @IsString()
  @ApiProperty({ example: 'username', description: 'User name' })
  username!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'password', description: 'password' })
  password!: string;

  @IsEmail()
  @ApiProperty({ example: 'email.example.com', description: "User's email" })
  email!: string;
}
