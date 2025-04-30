import { Body, Controller, forwardRef, Inject, Post } from '@nestjs/common';
import { EmailService } from './email.service';
import { UserEmailVerificationDto } from '../user/dto/UserEmailVerificationDto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MessageDto } from '../../common/dto/MessageDto';

@ApiTags('EMAIL')
@Controller('email')
export class EmailController {
  constructor(
    @Inject(forwardRef(() => EmailService))
    private readonly emailService: EmailService,
  ) {}

  @ApiOperation({ summary: 'Send User email verification token' })
  @ApiResponse({ status: 200, type: MessageDto })
  @Post('send-email-verification')
  async sendEmailVerificationToken(@Body() userDto: UserEmailVerificationDto) {
    await this.emailService.sendEmailVerification(userDto);
    return new MessageDto(
      `Verification link successfully sended to: ${userDto.email}!`,
    );
  }
}
