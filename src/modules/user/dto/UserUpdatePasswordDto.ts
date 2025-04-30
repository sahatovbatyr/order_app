import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserUpdatePasswordDto {
  // @ApiProperty({ example: 'username', description: 'Username' })
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: '1', description: 'User id' })
  readonly id!: number;

  // @ApiProperty({ example: 'username', description: 'Username' })
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'username', description: 'User name' })
  readonly username!: string;

  // @ApiProperty({ example: 'old123', description: 'Old password' })
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'oldPassword', description: 'Users old password' })
  readonly oldPassword!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'new123', description: 'Users new password' })
  readonly newPassword!: string;

  @ApiProperty({ example: 'new123', description: 'New password confirmation' })
  @IsNotEmpty()
  @IsString()
  readonly newPasswordConfirmation!: string;
}
