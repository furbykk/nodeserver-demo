import {Factory, Seeder} from "typeorm-seeding";
import {Connection, getRepository} from "typeorm";
import {Product} from "../../entity/Product";


export class ProductSeed implements Seeder{
    public async run(factory:Factory, connection:Connection):Promise<void> {
        //admin
        const repo = getRepository(Product)

        await factory(Product)().map(async p => {
            console.log('pd created: ', p)
            return p
        }).createMany(5)
    }
}