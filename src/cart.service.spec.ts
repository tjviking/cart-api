import { Test, TestingModule } from '@nestjs/testing';
import { CartController } from './cart.controller';
import { ProductController } from './product.controller';
import { CartService, AddProductDto } from './cart.service';
import { ProductService, CreateProductDto } from './product.service';
import { Product } from './product';
import { CurrencyService } from './currency.service';
import { ScheduleModule } from '@nestjs/schedule';

describe('ProductService', () => {

  beforeAll(async () => {
    await CurrencyService.freshen();
  });

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [ScheduleModule.forRoot()],
      controllers: [CartController, ProductController],
      providers: [CartService, ProductService, CurrencyService]
    }).compile();

    CurrencyService.freshen();
  });

  describe('createProduct', () => {

    let prd : CreateProductDto = {
      name: 'test product',
      price: 10,
      description: 'product description',
      currency: 'USD',
      quantity: 100
    };

    it('should allow creation of product', () => {
      expect(ProductService.createProduct(prd)).toMatchObject(prd);
    });
  });

  describe('getAllProducts', () => {

    let prd : Array<Product> = [{
      name: 'test product',
      price: 10,
      description: 'product description',
      currency: 'USD',
      quantity: 100,
      id: 1
    }];


    it('should allow to list defined products', () => {
      expect(ProductService.getAllProducts()).toMatchObject(prd);
    });
  });




});

describe('CartService', () => {

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CartController, ProductController],
      providers: [CartService, ProductService],
    }).compile();

  });;

  describe('createCart', () => {
    it('should return success', () => {
      expect(CartService.createCart());
    });
  });


  describe('addProduct', () => {

    let prd : AddProductDto = {
      id: 1,
      quantity: 2
    };


    it('should allow to add product to cart', () => {
      expect(CartService.addProduct(prd));
    });
  });


  describe('listProducts', () => {

    let prd : Array<Product> = [{
      name: 'test product',
      price: 10,
      description: 'product description',
      currency: 'USD',
      quantity: 100,
      quantityInCart: 2,
      id: 1
    }];

    it('should allow to list products in the cart', () => {
      expect(CartService.listProducts()).toMatchObject(prd);
    });
  });


  describe('checkout', () => {



    it('should allow to checkout in selected currency', () => {
      expect(CartService.checkout('USD'));
    });
  });

});
