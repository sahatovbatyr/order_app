import { IsArray, IsInt, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserUpdateRolesDto {
  // @ApiProperty({ example: '1', description: 'User id' })
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: '1', description: 'User id ' })
  readonly id!: number;

  // @ApiProperty({ example: '[ 1, 2, 3]', description: 'Role id List' })
  @IsNotEmpty()
  @IsArray()
  @IsInt({ each: true })
  @ApiProperty({ example: '[ 1, 2, 3 ]', description: 'User role list' })
  readonly roleIdList!: number[];
}
