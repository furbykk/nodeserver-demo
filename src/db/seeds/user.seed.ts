import {Factory, Seeder} from "typeorm-seeding";
import {Connection, getRepository} from "typeorm";
import {User} from "../../entity/User";


export class UserSeed implements Seeder{
    public async run(factory:Factory, connection:Connection):Promise<void> {
        //admin
        const repo = getRepository(User)
        let user = new User()
        user.firstName = 'Jonathan'
        user.lastName = 'Yeh'
        user.isStaff = true
        user.email = 'jonathan@gmail.com'
        user.password = 'jonathan123'
        user.age = 25
        await repo.save(user)

        let user2 = new User()
        user2.firstName = 'Mark'
        user2.lastName = 'Lee'
        user2.isStaff = false
        user2.email = 'mark@gmail.com'
        user2.password = 'marklee123'
        user2.age = 19
        let userSaved2 = await repo.save(user2)
    }
}