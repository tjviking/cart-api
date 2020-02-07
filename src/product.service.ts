import { Injectable, HttpStatus, Response, mixin } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { CurrencyService } from './currency.service'; 
import { Product } from './product';
import { IsInt, IsString, Min, IsNumber } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @ApiProperty({
    description: 'Name of the product'
  })
  readonly name: string;

  @IsNumber()
  @Min(0.01)
  @ApiProperty({
    type: Number,
    description: 'Price of 1 unit of product'
  })  
  readonly price: number;
  
  @ApiProperty({
    description: 'Currency for product price'
  })  
  readonly currency: string;
  
  @IsInt()
  @Min(0)
  @ApiProperty({
    type: Number,
    description: 'Quantity of the product units in the store'
  })  
  readonly quantity: number;
  
  @IsString()
  @ApiProperty({
    description: 'Description of the product'
  })  
  readonly description: string;
}

@Injectable()
export class ProductService {

  /* static products store */
  static products: Array<Product> = []; 

  /* generates new id of product */
  static genNewId() : number {
    let newId : number = 1;
    ProductService.products.forEach((prod) => {
        if (newId<=prod.id) newId=prod.id+1;
    });
    return newId;
  }

  /* checks and gets product from the store */
  static getProduct(id: number) : Product | null {
    let fnd : Product | null = null;
    ProductService.products.forEach((prod) => {
      if (prod.id === id) fnd = prod; 
    });
    return fnd;
  }

  /* checks and gets product index in the store */
  static getProductIndex(id: number) : number | null {
    let fnd : number | null = null;
    ProductService.products.forEach((prod, idx) => {
      if (prod.id === id) fnd = idx;
    });
    return fnd;
  }

  /* creates new product in the store */
  static createProduct(prodDef: CreateProductDto): Product | null {

    
    let cur = CurrencyService.get(prodDef.currency);

    if (cur) {
      let newProd = prodDef as Product; 
      newProd.id = ProductService.genNewId();
      ProductService.products.push(newProd);
      return newProd;
    } else return null;
  }

  static getAllProducts(): Array<Product> {
    return ProductService.products;
  }
}
