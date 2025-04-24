import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { EnvConfigEnum } from './enums/EnvConfigEnum';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CustomValidationPipe } from './common/pipes/CustomValidationPipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get<ConfigService>(ConfigService);

  const config = new DocumentBuilder()
    .setTitle('App API')
    .setDescription('The App API ')
    .setVersion('1.0')
    .addTag('app')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/doc', app, documentFactory);

  const port: number =
    configService.get<number>(EnvConfigEnum.HOST_PORT) ?? 3000;

  app.setGlobalPrefix('api');

  const validationPipe = new CustomValidationPipe();
  app.useGlobalPipes(validationPipe);

  await app.listen(port);
  console.log(`Server started on port:${port}`);
}
bootstrap();
