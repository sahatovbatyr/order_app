import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { EnvConfigEnum } from '../../enums/EnvConfigEnum';
import { User } from '../../entities/user.entity';
import { Role } from '../../entities/role.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get(EnvConfigEnum.DB_HOST),
        port: configService.get(EnvConfigEnum.DB_PORT),
        username: configService.get(EnvConfigEnum.DB_USERNAME),
        password: configService.get(EnvConfigEnum.DB_PASSWORD),
        database: configService.get(EnvConfigEnum.DB_NAME),
        // entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
        entities: [User, Role],
        // synchronize: configService.get(EnvConfigEnum.NODE_ENV) !== 'production',
        logging: true,
        synchronize: true,
        charset: 'utf8',
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
