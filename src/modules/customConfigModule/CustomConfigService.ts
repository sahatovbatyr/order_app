import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvConfigEnum } from '../../enums/EnvConfigEnum';

@Injectable()
export class CustomConfigService {
  constructor(private configService: ConfigService) {}

  get HOST(): string {
    return this.configService.getOrThrow<string>(EnvConfigEnum.HOST);
  }

  get HOST_PORT(): string {
    return this.configService.getOrThrow<string>(EnvConfigEnum.HOST_PORT);
  }

  get EMAIL_SMTP_HOST(): string {
    return this.configService.getOrThrow<string>(EnvConfigEnum.EMAIL_SMTP_HOST);
  }

  get EMAIL_SMTP_PORT(): number {
    return this.configService.getOrThrow<number>(EnvConfigEnum.EMAIL_SMTP_PORT);
  }

  get EMAIL_USER_NOREPLY(): string {
    return this.configService.getOrThrow<string>(
      EnvConfigEnum.EMAIL_USER_NOREPLY,
    );
  }

  get EMAIL_PASSWORD(): string {
    return this.configService.getOrThrow<string>(EnvConfigEnum.EMAIL_PASSWORD);
  }

  get EMAIL_JWT_SECRET(): string {
    return this.configService.getOrThrow<string>(
      EnvConfigEnum.EMAIL_JWT_SECRET,
    );
  }

  get EMAIL_JWT_ACCESS_EXPIRATION(): string {
    return this.configService.getOrThrow<string>(
      EnvConfigEnum.EMAIL_JWT_ACCESS_EXPIRATION,
    );
  }

  get EMAIL_VERIFICATION_URL_TEMPLATE(): string {
    return this.configService.getOrThrow<string>(
      EnvConfigEnum.EMAIL_VERIFICATION_URL_TEMPLATE,
    );
  }
}
