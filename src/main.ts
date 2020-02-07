import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { CurrencyService } from './currency.service';
import { AppConfig } from './app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle('Cart API for FlipFit')
    .setDescription('Coding Flip API Task')
    .setVersion('1.0')
   // .addTag('cart-api')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);


  await CurrencyService.freshen();

  await app.listen(AppConfig.listenPort);

}
bootstrap();
