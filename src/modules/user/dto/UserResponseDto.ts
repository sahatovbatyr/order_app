import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @Expose()
  @ApiProperty({ example: '1', description: 'User id ' })
  id!: number;

  @Expose()
  @ApiProperty({ example: 'my_username', description: 'username' })
  username!: string;

  @Exclude()
  @ApiProperty({ example: 'xyz', description: 'password' })
  password!: string;
}
