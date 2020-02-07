import { Controller, Get, Post, Body, Response, HttpStatus } from '@nestjs/common';
import { ProductService, CreateProductDto } from './product.service';
import { ApiNotFoundResponse, ApiConflictResponse, ApiCreatedResponse, ApiResponse  } from '@nestjs/swagger';
import { Product } from './product';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('createProduct')
  @ApiCreatedResponse({status: 201, description: 'Creates new product in store definitions.'})
  @ApiNotFoundResponse({description: 'When currency does not exist in the store table.'})
  createProduct(@Body() createProductDto: CreateProductDto, @Response() response ): Response {

    let product = ProductService.createProduct(createProductDto);
    if (!product)
      return response.status(HttpStatus.NOT_FOUND).send();
    return response.status(HttpStatus.CREATED).send(product);
  }


  @Get('getAllProducts')
  @ApiResponse({status: 200, type: [Product], description: 'Returns list of store defined products.'})
  getAllProducts(): Array<Product> {
    return ProductService.getAllProducts();
  }

}
