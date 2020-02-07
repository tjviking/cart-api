import { Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Product } from './product';
import { IsInt, IsString, Min, IsNumber, IsArray } from 'class-validator';
import { ProductService } from './product.service';
import { CurrencyService } from './currency.service';

export class Cart {

  @IsArray()
  @ApiProperty({
    type: [Product],
    description: 'List of products added to cart.'
  })
  products?: Array<Product> = [];

  @IsString()
  @ApiProperty({
    description: 'Currency used to checkout the cart.'
  })
  currency?: string = '';

  @IsNumber()
  @ApiProperty({
    type: Number,
    description: 'Value of cart in given currency.'
  })
  value?: number = 0;
}


export class AddProductDto {
  @IsInt()
  @ApiProperty({
    description: 'Id of the product to add to cart'
  })
  readonly id: number;

  @IsInt()
  @Min(1)
  @ApiProperty({
    type: Number,
    description: 'Quantity of the product to add to cart'
  })
  readonly quantity: number;
}


@Injectable()
export class CartService {

  /* static cart store */
  static cart: Cart = new Cart();

  /* find product in cart by product id */
  static findProduct(id: number): Product | null {
    let fnd: Product | null = null;
    CartService.cart.products.forEach((prd) => {
      if (prd.id === id) fnd = prd;
    });
    return fnd;
  }

  /* find index in cart by product id */
  static findProductIndex(id: number): number | null {
    let fnd: number | null = null;
    CartService.cart.products.forEach((prd, idx) => {
      if (prd.id === id) fnd = idx;
    });
    return fnd;
  }


  /* creates or resets new cart */
  static createCart(): void {
    CartService.cart = new Cart();
  }

  /* adds product into cart */
  static addProduct(prod: AddProductDto): boolean | null {

    let fndIdx = CartService.findProductIndex(prod.id);

    if (fndIdx !== null) {//exists in cart, lets merge
      //check quantity avaiable
      let prd: Product | null;
      prd = ProductService.getProduct(prod.id);
      if (prd) {
        if (prd.quantity >= prod.quantity) { //proceed
          prd.quantity -= prod.quantity;
          CartService.cart.products[fndIdx].quantityInCart += prod.quantity;
          return true;
        } else { //too low quantity in the store
          return false;
        }
      } else return null;

    } else {//not yet in cart
      //check quantity avaiable
      let prd: Product | null;
      prd = ProductService.getProduct(prod.id);
      if (prd) {
        if (prd.quantity >= prod.quantity) { //proceed
          let prdCopy: Product = Object.assign({}, prd) as Product;
          prdCopy.quantityInCart = prod.quantity;
          prd.quantity -= prod.quantity;
          CartService.cart.products.push(prdCopy);
          return true;
        } else { //too low quantity in the store
          return false;
        }
      } else return null;
    }

  }

  /* removes product from cart */
  static removeProduct(id: number): boolean {
    let fndIdx = CartService.findProductIndex(id);
    if (fndIdx !== null) {
      //return to store
      let prdIdx: number | null;
      prdIdx = ProductService.getProductIndex(id);
      if (prdIdx !== null)
        ProductService.products[prdIdx].quantity += CartService.cart.products[fndIdx].quantityInCart;
      CartService.cart.products.splice(fndIdx, 1);
      return true;
    } else return false;
  }

  /* changes product quantity in the cart */
  static changeProductQuantity(prod: AddProductDto): boolean {
    let fndIdx = CartService.findProductIndex(prod.id);
    if (fndIdx !== null) {
      if (prod.quantity >= 0) {
        let prdIdx: number | null;
        prdIdx = ProductService.getProductIndex(prod.id);
        if (prdIdx !== null) {

          let after: number = ProductService.products[prdIdx].quantity - prod.quantity + CartService.cart.products[fndIdx].quantityInCart;

          if (after >= 0) {//proceed if we can change quantity
            ProductService.products[prdIdx].quantity += CartService.cart.products[fndIdx].quantityInCart - prod.quantity;
            CartService.cart.products[fndIdx].quantityInCart = prod.quantity;
            return true;
          } else return false;

        } else return false;

      } else return false;
    } else return false;
  }

  /* lists products already added to cart */
  static listProducts(): Array<Product> {
    return CartService.cart.products;
  }

  /* calculates checkout of the cart */
  static checkout(currency: string): Cart | null {

    let curValue : number | null | undefined = CurrencyService.get(currency);

    if (curValue) {

      CartService.cart.currency = currency;
      CartService.cart.value = 0;

      let sum: number = 0;

      CartService.cart.products.forEach((prod) => {
        let tmpVal = CurrencyService.recalculate(prod.currency, currency, prod.price);
        prod.priceCheckout = tmpVal;
        sum+=prod.quantityInCart * tmpVal;
      });
      
      CartService.cart.value = sum;

      return CartService.cart;
    } else return null;

  }

}
