import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenDto } from '../auth/dto/TokenDto';
import { UserEmailVerificationDto } from '../user/dto/UserEmailVerificationDto';
import { MailerService } from '@nestjs-modules/mailer';
import { EmailDto } from './dto/EmailDto';
import { CustomConfigService } from '../customConfigModule/CustomConfigService';
import { UserService } from '../user/user.service';
import { User } from '../../entities/user.entity';

@Injectable()
export class EmailService {
  constructor(
    private jwtService: JwtService,
    private readonly mailService: MailerService,
    private readonly customConfigService: CustomConfigService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  private generateToken(user: UserEmailVerificationDto): TokenDto {
    const token = this.jwtService.sign(
      {
        username: user.username,
        purpose: 'email-verification',
      },
      { secret: this.customConfigService.EMAIL_JWT_SECRET },
    );

    return new TokenDto(token);
  }

  public getPayload(token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.customConfigService.EMAIL_JWT_SECRET,
      }) as {
        username: string;
        purpose: string;
      };
      return payload;
    } catch (err) {
      if (err instanceof Error) {
        throw new UnauthorizedException(
          `Unautorized user. Token verification failed: ${err}`,
        );
      }
      throw new UnauthorizedException(
        `Unautorized user. Token verification failed`,
      );
    }
  }

  async sendEmailVerification(userDto: UserEmailVerificationDto) {
    const emailDto = new EmailDto();
    let user: User;
    if (userDto.username) {
      user = await this.userService.findByUsername_orThrow(userDto.username);
    } else if (userDto.email) {
      user = await this.userService.findByEmail_orThrow(userDto.email);
    } else {
      throw new UnauthorizedException('Invalid login credentials');
    }

    if (
      user.username != userDto.username ||
      user.email != userDto.email ||
      !(await this.userService.isPasswordValid(userDto.password, user.password))
    ) {
      throw new UnauthorizedException('Invalid login credentials');
    }

    emailDto.sender = this.customConfigService.EMAIL_USER_NOREPLY;
    emailDto.receiver = user.email;
    emailDto.subject = 'Email verification';
    const tokenDto = this.generateToken(user);

    const url = this.getEmailVerificationUrl(tokenDto.token);
    emailDto.message = `Please, follow the link ${url} to verify the email.`;

    await this.sendMail(emailDto);
  }

  private getEmailVerificationUrl(token: string) {
    const urlTemplate =
      this.customConfigService.EMAIL_VERIFICATION_URL_TEMPLATE;
    const host = this.customConfigService.HOST;
    const hostPort = this.customConfigService.HOST_PORT;
    const res = urlTemplate
      .replace(':host', `${host}`)
      .replace(':port', `${hostPort}`)
      .replace(':token', encodeURIComponent(token));

    console.log('urlTemplate:', res);

    return res;
  }

  private async sendMail(emailDto: EmailDto) {
    // const htmlTemplate = await this.getTemplate('default');

    // TypeScript hack to access private property (use cautiously)
    const transporter = (this.mailService as any).transporter;

    if (transporter) {
      console.log('SMTP Host:', transporter.options.host);
      console.log('SMTP Auth User:', transporter.options.auth?.user);

      // Test connection
      await transporter.verify();
      console.log('SMTP Connection verified!');
    }

    try {
      this.mailService.sendMail({
        from: emailDto.sender,
        to: emailDto.receiver,
        subject: emailDto.subject,
        text: emailDto.message,
        // template: htmlTemplate,
        // context: { // Data to be passed to template
        //   name: name,
        //   joinDate: new Date().toLocaleDateString(),
        //   promoCode: 'WELCOME20',
        //   currentYear: new Date().getFullYear(),
        // },
      });
    } catch (err: any) {
      throw new InternalServerErrorException(
        `Message sending Error.${err.message}`,
      );
    }
  }
}
