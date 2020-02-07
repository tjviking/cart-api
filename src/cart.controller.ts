import { Controller, Get, Post, Body,Response, HttpStatus, Param } from '@nestjs/common';
import { CartService, AddProductDto, Cart } from './cart.service';
import { ApiNotFoundResponse, ApiConflictResponse, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { Product } from './product';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('createCart')
  @ApiOkResponse({description: 'Creates new cart.'})
  createCart(): void {
    CartService.createCart();
  }

  @Post('addProduct')
  @ApiCreatedResponse({description: 'Adds product to cart with given quantity.'})
  @ApiNotFoundResponse({description: 'When product does not exist.'})
  @ApiConflictResponse({description: 'When product does not have requested quantity in the store.'})
  addProduct(@Body() addProductDto: AddProductDto, @Response() response ): Response {
    let result : boolean | null;
    result = CartService.addProduct(addProductDto);
    if (result===false) return response.status(HttpStatus.CONFLICT).send();
    if (result===true) return response.status(HttpStatus.CREATED).send();
    return response.status(HttpStatus.NOT_FOUND).send();
  }

  @Post('changeProductQuantity')
  @ApiCreatedResponse({description: 'Changes product in cart with given quantity.'})
  @ApiNotFoundResponse({description: 'When product does not exist in cart.'})
  changeProductQuantity(@Body() addProductDto: AddProductDto, @Response() response): Response {
    let result : boolean;
    result = CartService.changeProductQuantity(addProductDto);
    if (result===true) return response.status(HttpStatus.CREATED).send();
    return response.status(HttpStatus.NOT_FOUND).send();
  }

  @Get('removeProduct/:id')
  @ApiCreatedResponse({description: 'When removed with success.'})
  @ApiNotFoundResponse({description: 'When product does not exist in cart.'})
  removeProduct(@Param('id') id: number, @Response() response): Response {
    let result : boolean;
    result = CartService.removeProduct(id);
    if (result===true) return response.status(HttpStatus.CREATED).send();
    return response.status(HttpStatus.NOT_FOUND).send();
  }

  @Get('checkout/:currency')
  @ApiCreatedResponse({description: 'When checkout with success.'})
  @ApiNotFoundResponse({description: 'When currency does not exist.'})
  checkout(@Param('currency') currency: string, @Response() response): Response {
    let result : Cart | null;
    result = CartService.checkout(currency);
    if (result) return response.status(HttpStatus.CREATED).send(result);
    return response.status(HttpStatus.NOT_FOUND).send();
  }

  @Get('listProducts')
  @ApiOkResponse({description: 'Lists all products in the cart.'})
  listProducts(): Array<Product> {
    return CartService.cart.products;
  }

}
