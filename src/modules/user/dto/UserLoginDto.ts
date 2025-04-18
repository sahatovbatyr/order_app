import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserLoginDto {
  @ValidateIf((object) => !object.email)
  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'username', description: 'User name' })
  username!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'password', description: 'password' })
  password!: string;

  @ValidateIf((object) => !object.username)
  @IsEmail()
  @IsOptional()
  @ApiProperty({ example: 'password', description: 'password' })
  email!: string;
}
