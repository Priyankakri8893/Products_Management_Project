const cartModel= require("../models/cartModel")
const {isValid}= require("../validation/isvalid")
const userModel= require("../models/userModel")
const { default: mongoose } = require("mongoose")
const productModel= require("../models/productModel")


const postCart= async (req, res) => {
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

        let userIdExitInCart= await cartModel.findOne({
            userId: userId
        })

        let {items}= req.body
        if(items.length === 0){
            return res.status(400).send({
                status: false,
                message: "please provide items detail"
            })
        }

        let totalPrice= 0
        let totalItems= 0

        for(let i=0; i<items.length; i++){
            if(!isValid(items[i].productId)){
                return res.status(404).send({
                    status: false,
                    message: "please provide productId"
                })
            }

            if(!mongoose.isValidObjectId(items[i].productId)){
                return res.status(400).send({
                    status: false,
                    message: "productId is not valid"
                })
            }

            let productIdExit= await productModel.findById({
                _id: items[i].productId
            })

            if(!productIdExit){
                return res.status(404).send({
                    status: false,
                    message: "productId is not exit"
                })
            }

            if(items[i].quantity < 1){
                return res.status(400).send({
                    status: false,
                    message: "provide quantity"
                })
            }

            totalPrice += items[i].quantity * productIdExit.price
            totalItems += items[i].quantity
        }
        if(!userIdExitInCart){
            req.body.userId= userId
            req.body.totalPrice= totalPrice
            req.body.totalItems= totalItems

            let cartCreate= await cartModel.create(req.body)

            res.status(201).send({
                status: true,
                message: "cart successfully created",
                data: cartCreate
            })
        }else{
            userIdExitInCart.items.concat(items)
            userIdExitInCart.totalPrice += totalPrice
            userIdExitInCart.totalItems += totalItems

            let cartCreate= await userIdExitInCart.save()

            res.status(201).send({
                status: true,
                message: "cart added successfully",
                data: cartCreate
        })
    }

    } catch (error) {
        res.status(500).send({
            status: false,
            error: error.message
        })
    }
}

// ********************************************************************************** //

const updateCart= async (req, res) => {
    try {
        
    } catch (error) {
        res.status(500).send({
            status: false,
            error: error.message
        })
    }
}

// ********************************************************************************** //

const getCart= async (req, res) => {
    try {
        
    } catch (error) {
        res.status(500).send({
            status: false,
            error: error.message
        })
    }
}

// ********************************************************************************** //

const deleteCart= async (req, res) => {
    try {
        
    } catch (error) {
        res.status(500).send({
            status: false,
            error: error.message
        })
    }
}


module.exports= {postCart, updateCart, getCart, deleteCart}