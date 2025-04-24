import { forwardRef, Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { EmailConfigModule } from '../emailConfigModue/EmailConfigModule';
import { CustomConfigService } from '../customConfigModule/CustomConfigService';
import { CustomConfigModule } from '../customConfigModule/CustomConfigModule';

@Module({
  imports: [
    EmailConfigModule,
    CustomConfigModule,
    forwardRef(() => UserModule),
    JwtModule.registerAsync({
      imports: [CustomConfigModule],
      useFactory: async (customConfigService: CustomConfigService) => ({
        global: true,
        secret: customConfigService.EMAIL_JWT_SECRET,
        signOptions: {
          expiresIn: customConfigService.EMAIL_JWT_ACCESS_EXPIRATION,
        },
      }),
      inject: [CustomConfigService],
    }),
  ],
  controllers: [EmailController],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
