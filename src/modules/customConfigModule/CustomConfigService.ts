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

  // `logs/application-%DATE%.log`
  get LOGGER_FILE_PATH(): string {
    const basePath = this.configService.get<string>(
      EnvConfigEnum.LOGGER_FILE_PATH,
    );
    return basePath ?? 'logs';
  }

  get LOGGER_ERROR_FILE_PATH(): string {
    const basePath = this.configService.get<string>(
      EnvConfigEnum.LOGGER_ERROR_FILE_PATH,
    );
    return basePath ?? 'logs/app_%DATE%_error.log';
  }

  get LOGGER_IS_ZIP_ARCHIVE(): boolean {
    //****************************
    // LOGGER_IS_ZIP_ARCHIVE=true  # for string value
    // LOGGER_IS_ZIP_ARCHIVE=1     # for number value
    // LOGGER_IS_ZIP_ARCHIVE="true" # for JSON value
    const value = this.configService.get<string>(
      EnvConfigEnum.LOGGER_IS_ZIP_ARCHIVE,
    );

    if (value === undefined || value === null) {
      return true; // Default value
    }

    // for string value : 'true'/'false' (without JSON.parse)
    if (value.toLowerCase() === 'true') return true;
    if (value.toLowerCase() === 'false') return false;

    // for number value (1/0)
    if (value === '1') return true;
    if (value === '0') return false;

    // for JSON  ("true"/"false")
    try {
      return JSON.parse(value);
    } catch {
      return true; // Fallback если парсинг не удался
    }
  }

  get LOGGER_MAX_SIZE(): string {
    return (
      this.configService.get<string>(EnvConfigEnum.LOGGER_MAX_SIZE) ?? '20m'
    );
  }

  get LOGGER_MAX_FILES(): string {
    return (
      this.configService.get<string>(EnvConfigEnum.LOGGER_MAX_FILES) ?? '14d'
    );
  }

  get LOGGER_LEVEL(): string {
    return this.configService.get<string>(EnvConfigEnum.LOGGER_LEVEL) ?? 'info';
  }
}
