import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // This allows your Angular app to talk to your NestJS app
  app.enableCors({
    origin: 'http://localhost:4200'
  });
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
