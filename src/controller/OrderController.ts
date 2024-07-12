import {NextFunction, Request, Response} from "express";
import {Order} from "../entity/Order";
import {getRepository} from "typeorm";
import {Err, ErrStr, HttpCode} from "../helper/Err";
import {ProductController} from "./ProductController";
import {UserController} from "./UserController";
import {validate} from "class-validator";
import {IdCheckRes, JyController} from "./JyController";

export class OrderController extends JyController {

    public static get repo() {
        return getRepository(Order)
    }

    static async all(request: Request, response: Response, next: NextFunction) {
        let orders = []
        try {
            orders = await OrderController.repo.find()
        } catch (e) {
            console.log('error, write to db', e)
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrStore, e))
        }
        return response.status(200).send(new Err(HttpCode.E200, ErrStr.OK, orders))
    }

    static async one(request: Request, response: Response, next: NextFunction) {
        const {orderId} = request.params
        if (!orderId) {
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrMissingParameter))
        }
        let order = null
        try {
            order = await OrderController.repo.findOneOrFail(orderId)
        } catch (e) {
            console.log('error, write to db', e)
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrStore, e))
        }
        return response.status(200).send(new Err(HttpCode.E200, ErrStr.OK, order))
    }

    static async create(request: Request, response: Response, next: NextFunction) {

        let {
            price, taxRate, total, user, product
        } = request.body
        let order = new Order()
        order.taxRate = taxRate
        order.price = price
        order.total = total

        try {
            const errors = await validate(order)
            if (errors.length > 0) {
                return response.status(HttpCode.E400).send(new Err(HttpCode.E400, '', errors))
            }

            let result = await OrderController.validateOrder(user, product)

            order.user = result[0].entities[0]
            order.products = result[1].entities
            await OrderController.repo.save(order)


        } catch (e) {
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrStore, e))
        }

        return response.status(HttpCode.E200).send(new Err(HttpCode.E200, ErrStr.OK, order))
    }

    static async remove(request: Request, response: Response, next: NextFunction) {

    }

    static async update(request: Request, response: Response, next: NextFunction) {

    }

    static async validateOrder (user: number, products: number[]) {
        if (typeof user !== 'number' ||
            user <= 0 ||
            !Array.isArray(products)
        ) {
            throw (new Err(HttpCode.E400, 'invalid user id or product ids'))
        }

        let result: IdCheckRes[] = []

        try {
            let temp = await super.checkIdExits([user], UserController.repo)
            if (temp.index !== -1) {
                throw (new Err(HttpCode.E400, 'invalid user id, ' + temp.index))
            }
            result.push(temp)

            temp = await OrderController.checkIdExits(products, ProductController.repo)
            if (temp.index !== -1) {
                throw (new Err(HttpCode.E400, 'invalid product id, ' + temp.index))
            }
            result.push(temp)
        } catch (e) {
            console.log('error, write to db', e)
            throw (new Err(HttpCode.E400, 'invalid user id or product id ',e ))
        }
        return result
    }
}