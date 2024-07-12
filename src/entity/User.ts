import {Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn, UpdateDateColumn, OneToMany} from "typeorm";
import {IsEmail, Length, Max, Min} from "class-validator"
import {Order} from "./Order";

@Entity()
@Unique(['email'])
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Length(1, 100)
    firstName: string;

    @Column()
    @Length(1,100)
    lastName: string;

    @Column({nullable:true})
    @Min(15)
    @Max(120)
    age: number;

    @Column()
    @IsEmail()
    @Length(5,150)
    email:string

    @Column()
    @Length(6, 200)
    password:string

    @Column({nullable:true, default:false})
    isStaff: boolean

    @Column({nullable:true, default:false})
    isActive:boolean

    @Column({nullable:true, default:false})
    isDeleted:boolean

    @Column()
    @CreateDateColumn()
    createdAt: Date

    @Column()
    @UpdateDateColumn()
    updatedAt: Date

    @OneToMany(() => Order, order => order.user)
    orders: Order

}
