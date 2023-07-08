const userModel= require('../models/userModel')
const cartModel= require('../models/cartModel')
const productModel= require('../models/productModel')
const orderModel= require('../models/orderModel')
const {isValid}= require('../validation/isvalid')

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
        if(req["x-api-key"].userId != userIdExit._id){
            return res.status(403).send({
                status: false,
                message: "unauthorized, userId not same"
            })
        }

        //check cart exit or not
        let cartExit= await cartModel.findById({userId: userId})
        if(!cartExit){
            return res.status(404).send({
                status: false,
                message: 'cart not exit by this userId'
            })
        }

        let totalQuantity= 0
        for(let i=0; i<cartExit.items.length; i++){
            totalQuantity += cartExit.items[i].quantity
        }
        const order= {
            userId: userId,
            items: cartExit.items,
            totalPrice: cartExit.totalPrice,
            totalItems: cartExit.totalItems,
            totalQuantity: totalQuantity
        }

        let createOrder= await orderModel.create(order)

        res.status(201).send({
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
        if(req["x-api-key"].userId != userIdExit._id){
            return res.status(403).send({
                status: false,
                message: "unauthorized, userId not same"
            })
        }



    } catch (error) {
        res.status(500).send({
            status: false,
            error: error.message
        })
    }  
}

module.exports= {orders, updateOrders}