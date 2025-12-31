import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import config from './config/environment';
import { send } from 'process';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar class-validator para usar el contenedor de NestJS
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.setGlobalPrefix("api");

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  );

  app.enableCors({
    origin: config.panelAdmin,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true
  });

  await app.listen(config.port, () => {
    console.log(`BILLING ESTÁ ESCUCHANDO EL PUERTO ${config.port} CORRECTAMENTE!`);
  });
}

bootstrap();
