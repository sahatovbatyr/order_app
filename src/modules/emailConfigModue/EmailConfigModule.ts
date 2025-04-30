import { CustomConfigService } from '../customConfigModule/CustomConfigService';
import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { CustomConfigModule } from '../customConfigModule/CustomConfigModule';

@Module({
  imports: [
    CustomConfigModule,
    MailerModule.forRootAsync({
      imports: [CustomConfigModule],
      inject: [CustomConfigService],
      useFactory: (emailConfig: CustomConfigService) => ({
        transport: {
          host: emailConfig.EMAIL_SMTP_HOST,
          port: emailConfig.EMAIL_SMTP_PORT,
          secure: true,
          auth: {
            user: emailConfig.EMAIL_USER_NOREPLY,
            pass: emailConfig.EMAIL_PASSWORD,
          },
        },
      }),
    }),
  ],
  // providers: [CustomConfigService],
  exports: [MailerModule],
})
export class EmailConfigModule {}
