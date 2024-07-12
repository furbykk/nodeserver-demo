import {NextFunction, Request, Response} from "express";
import {getRepository} from "typeorm";
import {Product} from "../entity/Product";
import {Err, ErrStr, HttpCode} from "../helper/Err";
import {validate} from "class-validator";

export class ProductController {

    public static get repo() {
        return getRepository(Product)
    }

    static async all(request: Request, response: Response, next: NextFunction) {
        let products = []
        try {
            products = await ProductController.repo.find()
        } catch (e) {
            console.log('error, write to db', e)
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrStore, e))
        }
        return response.status(200).send(new Err(HttpCode.E200, ErrStr.OK, products))

    }

    static async one(request: Request, response: Response, next: NextFunction) {
        const {productId} = request.params
        if (!productId) {
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrMissingParameter))
        }
        let product = null
        try {
            product = await ProductController.repo.findOneOrFail(productId)
        } catch (e) {
            console.log('error, write to db', e)
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrStore, e))
        }
        return response.status(200).send(new Err(HttpCode.E200, ErrStr.OK, product))
    }

    static async create(request: Request, response: Response, next: NextFunction) {
        console.log('Request body:', request.body)
        let {name, price, media, slug, description} = request.body
        let product = new Product()
        product.name = name
        product.price = price
        product.media = media
        product.slug = slug
        product.description = description
        product.isActive = true

        console.log('product new:', product)
        try {
            const errors = await validate(product)
            if (errors.length > 0) {
                let err = new Err(HttpCode.E400, ErrStr.ErrMissingParameter)
                return response.status(400).send(err)
            }
            await ProductController.repo.save(product)
        } catch (e){
            console.log('error, write to db', e)
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrStore, e))
        }
        return response.status(200).send(new Err(HttpCode.E200, ErrStr.OK))
    }

    static async remove(request: Request, response: Response, next: NextFunction) {

    }

    static async update(request: Request, response: Response, next: NextFunction) {
        const {productId} = request.params
        if (!productId) {
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrMissingParameter))
        }
        let product = null
        try {
            product = await ProductController.repo.findOneOrFail(productId)
        } catch (e) {
            return response.status(HttpCode.E404).send(new Err(HttpCode.E404, ErrStr.ErrStore))
        }

        let {name, price, media, slug, description} = request.body
        product.name = name
        product.price = price
        product.media = media
        product.slug = slug
        product.description = description

        const errors = await validate(product)
        if (errors.length > 0) {
            return response.status(HttpCode.E400).send(new Err(HttpCode.E400, ErrStr.ErrMissingParameter, errors))
        }
        try {
            await ProductController.repo.save(product)
        } catch (e) {
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrStore, e))
        }
        return response.status(200).send(new Err(HttpCode.E200, ErrStr.OK))
    }
}