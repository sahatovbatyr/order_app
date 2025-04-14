import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { EnvConfigEnum } from './enums/EnvConfigEnum';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get<ConfigService>(ConfigService);

  const port: number =
    configService.get<number>(EnvConfigEnum.HOST_PORT) ?? 3000;

  await app.listen(port);
  console.log(`Server started on port:${port}`);
}
bootstrap();
