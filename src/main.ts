import { ValidationPipe } from '@nestjs/common'; 
import { NestFactory } from '@nestjs/core'; 
import { AppModule} from './app.module';


async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger : ['error', 'log', 'warn', 'debug']
  });

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: false,
    }),
  );

  app.setGlobalPrefix('api');

  await app.listen(3000);
}

bootstrap();