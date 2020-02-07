import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ScheduleModule } from '@nestjs/schedule';
import { CurrencyService } from './currency.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [CartController, ProductController],
  providers: [CartService, ProductService, CurrencyService],
})
export class AppModule {}
