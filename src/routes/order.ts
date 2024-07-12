import {Router} from "express";
import {OrderController} from "../controller/OrderController";

const router = Router()
// router.get('/', (req, resp) => {
//     resp.send('all orders')
// })
//
// router.get('/:orderId/:paymentStatus', (req, resp) => {
//     const {orderId, paymentStatus} = req.params
//     const {token, did} = req.headers
//     const reqBody = req.body
//
//     console.log('order body info:', reqBody )
//     // console.log('orderId is ', orderId, '; paymentStatus is ', paymentStatus)
//     resp.send(`orderId is ${orderId},  payment status is ${paymentStatus}, token=${token}, device=${did}`)
// })


router.get('/', OrderController.all)
router.get('/:orderId', OrderController.one)
router.post('/', OrderController.create)
router.put('/:orderId', OrderController.update)
router.delete('/:orderid', OrderController.remove)

export default router