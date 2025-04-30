import { ApiProperty } from '@nestjs/swagger';

export class TokenDto {
  @ApiProperty({ example: 'abcxyz', description: 'The access token' })
  token: string;

  constructor(token: string) {
    this.token = token;
  }
}
