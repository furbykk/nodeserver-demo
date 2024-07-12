import {define} from "typeorm-seeding";
import {Product} from "../../entity/Product";
import {Faker} from "@faker-js/faker";
import * as slug from   "slug"

// define(Product, (faker: typeof Faker) =>{
//     const product = new Product()
//     product.name = faker.commerce.productName()
//     product.slug = slug(product.name)
//     product.price = faker.commerce.price()
//     product.description = product.name
//     product.media = `${faker.image.avatar()}`
//     product.isActive = true
//
//     return product
// })