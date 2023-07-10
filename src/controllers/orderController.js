const userModel= require('../models/userModel')
const cartModel= require('../models/cartModel')
const productModel= require('../models/productModel')
const orderModel= require('../models/orderModel')
const {isValid}= require('../validation/isvalid')
const {mongoose}= require('mongoose')

const orders= async (req, res) => {
    try {
        let {userId}= req.params

        if(!isValid(userId)){
            return res.status(404).send({
                status: false, 
                message: "userId is invalid"
            })
        }

        if(!mongoose.isValidObjectId(userId)){
            return res.status(400).send({
                status: false, 
                message: "userId is not valid"
            }) 
        }

        //userId check in userModel
        let userIdExit= await userModel.findById({_id: userId})

        if(!userIdExit){
            return res.status(404).send({
                status: false, 
                message: "userId is not exit"
            })
        }

        //authorization check here
        // if(req["x-api-key"].userId != userIdExit._id){
        //     return res.status(403).send({
        //         status: false,
        //         message: "unauthorized, userId not same"
        //     })
        // }

        let {cartId}= req.body
        if(!isValid(cartId)){
            return res.status(404).send({
                status: false, 
                message: "cartId is invalid"
            })
        }

        if(!mongoose.isValidObjectId(cartId)){
            return res.status(400).send({
                status: false,  
                message: "cartId is not valid"
            }) 
        }
        //check cart exit or not
        let cartExit= await cartModel.findOne({userId: userId, _id: cartId})
        if(!cartExit || cartExit.items.length == 0){
            return res.status(404).send({
                status: false,
                message: 'first create cart then order it'
            })
        }

        let totalQuantity= 0
        for(let i=0; i<cartExit.items.length; i++){
            totalQuantity += cartExit.items[i].quantity
        }
        const order= {
            userId: userId,
            items: [...cartExit.items],
            totalPrice: cartExit.totalPrice,
            totalItems: cartExit.totalItems,
            totalQuantity: totalQuantity
        }

        let createOrder= await orderModel.create(order)

        cartExit.items= []
        cartExit.totalItems= 0
        cartExit.totalPrice= 0
        await cartExit.save()

        res.status(200).send({
            status: true,
            message: 'product is successfully order',
            data: createOrder
        })
    } catch (error) {
        res.status(500).send({
            status: false,
            error: error.message
        })
    }
}

// ********************************************************************************** //

const updateOrders= async (req, res) => {
    try {
        let {userId}= req.params

        if(!isValid(userId)){
            return res.status(404).send({
                status: false, 
                message: "userId is invalid"
            })
        }

        if(!mongoose.isValidObjectId(userId)){
            return res.status(400).send({
                status: false, 
                message: "userId is not valid"
            }) 
        }

        //userId check in userModel
        let userIdExit= await userModel.findById({_id: userId})

        if(!userIdExit){
            return res.status(404).send({
                status: false, 
                message: "userId is not exit"
            })
        }

        //authorization check here
        // if(req["x-api-key"].userId != userIdExit._id){
        //     return res.status(403).send({
        //         status: false,
        //         message: "unauthorized, userId not same"
        //     })
        // }

        let {orderId, status}= req.body

        if(!isValid(orderId)){
            return res.status(404).send({
                status: false, 
                message: "orderId is invalid"
            })
        }

        if(!mongoose.isValidObjectId(orderId)){
            return res.status(400).send({
                status: false,  
                message: "orderId is not valid"
            }) 
        }

        let statusOption= ['pending', 'completed', 'canceled']
        if(!status || !statusOption.includes(status)){
            return res.status(400).send({
                status: false,  
                message: "provide valid status"
            })
        }

        let orderExit= await orderModel.findOne({_id: orderId, userId: userId, isDeleted: false})

        if(!orderExit){
            return res.status(404).send({
                status: false,  
                message: "order not exit"
            })
        }

        if(status == 'canceled'){
            if(orderExit.cancellable == false){
                return res.status(400).send({
                    status: false,  
                    message: "order is already canceled"
                })
            }
        }

        if(status == 'canceled'){
            if(orderExit.cancellable == true){
                orderExit.status= 'canceled'
                orderExit.cancellable= false
                orderExit.deletedAt= Date.now()
                orderExit.isDeleted= true
            }
        }else{
            orderExit.status= status
        }

        let updateOrderStatus= await orderExit.save()

        res.status(200).send({
            status: true,
            message: 'status of order is updated successfully',
            data: updateOrderStatus
        })
    } catch (error) {
        res.status(500).send({
            status: false,
            error: error.message
        })
    }  
}

module.exports= {orders, updateOrders}