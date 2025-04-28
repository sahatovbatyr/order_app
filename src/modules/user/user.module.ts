import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { RoleModule } from '../role/role.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { EmailModule } from '../email/email.module';
import { CustomLoggerModule } from '../logger/logger.module';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => EmailModule),
    TypeOrmModule.forFeature([User]),
    RoleModule,
    CustomLoggerModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
