import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EmailDto {
  @IsEmail()
  @IsNotEmpty()
  @Length(3, 50, { message: 'No less 3 and great 50' })
  @ApiProperty({ example: 'sender@example.com', description: 'Sender email' })
  sender!: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    example: 'reeiver@example.com',
    description: 'Receiver email',
  })
  receiver!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Staff meeting  ', description: 'Email subject' })
  subject!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Please, can you ...', description: 'Email message' })
  message!: string;
}
