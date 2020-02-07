import { ApiProperty } from '@nestjs/swagger';

export class Product {
    @ApiProperty({
        type: Number,
        description: 'Unique id of the product'
    })
    id?: number;

    @ApiProperty({
        description: 'Name of the product'
    })
    name: string;

    @ApiProperty({
        type: Number,
        description: 'Price of 1 unit of product'
    })
    price: number;


    @ApiProperty({
        type: Number,
        description: 'Price of 1 unit in checkout currency'
    })
    priceCheckout?: number;

    @ApiProperty({
        description: 'Currency for product price'
    })
    currency: string;

    @ApiProperty({
        type: Number,
        description: 'Quantity of the product units in the store'
    })
    quantity: number;

    @ApiProperty({
        type: Number,
        description: 'Quantity of product added to cart'
    })
    quantityInCart?: number;

    @ApiProperty({
        description: 'Description of the product'
    })
    description: string;
}