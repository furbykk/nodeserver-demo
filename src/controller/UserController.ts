import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {User} from "../entity/User";
import {validate} from "class-validator";
import {Err, ErrStr, HttpCode} from "../helper/Err";


export class UserController {
    public static get repo() {
        return getRepository(User)
    }

    static async all(request: Request, response: Response, next: NextFunction) {
        let users = []
        try {
            users = await UserController.repo.find()
        } catch (e) {
            console.log('error, write to db', e)
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrStore, e))
        }
        return response.status(200).send(new Err(HttpCode.E200, ErrStr.OK, users))

    }

    static async one(request: Request, response: Response, next: NextFunction) {
        const {userId} = request.params
        if (!userId) {
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrMissingParameter))
        }
        let user = null
        try {
            user = await UserController.repo.findOneOrFail(userId)
        } catch (e) {
            console.log('error, write to db', e)
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrStore, e))
        }
        return response.status(200).send(new Err(HttpCode.E200, ErrStr.OK, user))
    }

    static async create(request: Request, response: Response, next: NextFunction) {
        console.log('Request body:', request.body)
        let {firstName, lastName, age, email, password} = request.body
        let user = new User()
        user.firstName = firstName
        user.lastName = lastName
        user.age = age
        user.email = email
        user.password = password
        user.isStaff = false
        user.isActive = false
        user.isDeleted = false

        console.log('user new:', user)
        try {
            const errors = await validate(user)
            if (errors.length > 0) {
                let err = new Err(HttpCode.E400, ErrStr.ErrMissingParameter)
                return response.status(400).send(err)
            }
            await UserController.repo.save(user)
        } catch (e){
            console.log('error, write to db', e)
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrStore, e))
        }
        return response.status(200).send(new Err(HttpCode.E200, ErrStr.OK))
    }

    static async delete(request: Request, response: Response, next: NextFunction) {

    }

    static async update(request: Request, response: Response, next: NextFunction) {
        const {userId} = request.params
        if (!userId) {
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrMissingParameter))
        }
        let user = null
        try {
            user = await UserController.repo.findOneOrFail(userId)
        } catch (e) {
            return response.status(HttpCode.E404).send(new Err(HttpCode.E404, ErrStr.ErrStore))
        }

        let {firstName, lastName, age, email, password} = request.body

        user.firstName = firstName
        user.lastName = lastName
        user.age = age
        user.email = email
        user.password = password

        const errors = await validate(user)
        if (errors.length > 0) {
            return response.status(HttpCode.E400).send(new Err(HttpCode.E400, ErrStr.ErrMissingParameter, errors))
        }
        try {
            await UserController.repo.save(user)
        } catch (e) {
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrStore, e))
        }
        return response.status(200).send(new Err(HttpCode.E200, ErrStr.OK))
    }
}