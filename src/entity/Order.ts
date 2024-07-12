import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne, ManyToMany, JoinTable
} from "typeorm";
import {Min} from "class-validator"
import {User} from "./User";
import {Product} from "./Product";
import order from "../routes/order";

@Entity()
export class Order {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('decimal', {precision: 5, scale: 2})
    @Min(0)
    price: number

    @Column('decimal', {precision: 5, scale: 2})
    @Min(0)
    total: number

    @Column('decimal', {precision: 5, scale: 2, default: 1.00})
    @Min(1)
    taxRate: number

    @ManyToMany(() => Product, (product) => product.orders)
    @JoinTable()
    products: Product[]

    @ManyToOne(() => User, user => user.orders)
    user: User

    @Column({nullable:true, default:false})
    isActive: boolean

    @Column({nullable:true, default:false})
    isDelete: boolean

    @Column()
    @CreateDateColumn()
    createdAt: Date

    @Column()
    @UpdateDateColumn()
    updatedAt: Date



}
