import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Unique,
    CreateDateColumn,
    UpdateDateColumn, ManyToMany,
} from "typeorm";
import {Length, Min} from "class-validator"
import {Order} from "./Order";

@Entity()
@Unique(['slug'])
export class Product {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Length(1, 200)
    slug: string;

    @Column()
    @Length(1,200)
    name: string;

    @Column('decimal', {precision: 5, scale:2})
    @Min(0)
    price: number;

    @Column()
    description:string

    @Column()
    media:string

    @Column({nullable:true, default:false})
    isActive: boolean

    @Column()
    @CreateDateColumn()
    createdAt: Date

    @Column()
    @UpdateDateColumn()
    updatedAt: Date

    @ManyToMany(() => Order, (order)=>order.products)
    orders: Order[]

}
