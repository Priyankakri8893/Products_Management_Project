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

        // //authorization check here
        // if(req["x-api-key"].userId != userIdExit._id){
        //     return res.status(403).send({
        //         status: false,
        //         message: "unauthorized, userId not same"
        //     })
        // }

        let userIdExitInCart= await cartModel.findOne({
            userId: userId
        })

        let {items}= req.body
        if(!items || items.length === 0){
            return res.status(400).send({
                status: false,
                message: "please provide items detail"
            })
        }

        let totalPrice= 0
        let totalItems= items.length

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
                _id: items[i].productId, isDeleted: false
            })

            if(!productIdExit){
                return res.status(404).send({
                    status: false,
                    message: "productId is not exit"
                })
            }

            if(items[i].quantity < '1'){
                return res.status(400).send({
                    status: false,
                    message: "provide quantity"
                })
            }

            totalPrice += parseInt(items[i].quantity) * productIdExit.price
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
            for(let i=0; i<items.length; i++){
                let productAlreadyExit= false
                for(let j=0; j<userIdExitInCart.items.length; j++){
                if(userIdExitInCart.items[j].productId == items[i].productId){
                    userIdExitInCart.items[j].quantity += parseInt(items[i].quantity)
                    productAlreadyExit= true
                    break;
                }
            }
            if(productAlreadyExit == false){
                userIdExitInCart.items.push(items[i])
            }
            }
            userIdExitInCart.totalPrice += totalPrice
            userIdExitInCart.totalItems = userIdExitInCart.items.length

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

        let {cartId, productId, removeProduct}= req.body
        
        //check id is valid or not
        if(!isValid(cartId)){
            return res.status(404).send({
                status: false, 
                message: "cartid is invalid"
            })
        }

        if(!mongoose.isValidObjectId(cartId)){
            return res.status(400).send({
                status: false, 
                message: "cartid is not valid"
            }) 
        }

        if(!isValid(productId)){
            return res.status(404).send({
                status: false, 
                message: "productId is invalid"
            })
        }

        if(!mongoose.isValidObjectId(productId)){
            return res.status(400).send({
                status: false, 
                message: "productId is not valid"
            }) 
        }
        //check cart exit or not
        let cartExit= await cartModel.findOne({
            userId: userId,
            _id: cartId
        })

        if(!cartExit){
            return res.status(404).send({
                status: false, 
                message: "userId & cartId is not valid"
            })
        }

        //product id check
        const itemExists = cartExit.items.some(item => item.productId.toString() === productId.toString());

        if (itemExists == false) {
          return res.status(404).send({
            status: false,
            message: "productId is not exit in cart"
          });
        }

        if(removeProduct != 0 && removeProduct != 1){
            return res.status(400).send({
                status: false,
                message: "provide removeProduct 0 or 1"
              });
        }

        const productIdCheckInProduct= await productModel.findById({_id: productId})

        for(let i=0; i<cartExit.items.length; i++){
            if(productId == cartExit.items[i].productId){
                if(removeProduct == 1){
                    if(cartExit.items[i].quantity > 1){
                        cartExit.items[i].quantity -= 1
                        cartExit.totalPrice -= productIdCheckInProduct.price
                        break
                    }else{
                        cartExit.items.splice(i, 1)
                        cartExit.totalPrice -= productIdCheckInProduct.price
                        cartExit.totalItems -= 1
                        break
                    }
                }else if(removeProduct == 0){
                    cartExit.items.splice(i, 1)
                    cartExit.totalPrice -= productIdCheckInProduct.price
                    cartExit.totalItems -= 1
                    break
                }
            }
        }

        let updateCart= await cartExit.save()
        
        res.status(200).send({
            status: true,
            message: "successfully update",
            data: updateCart
        })
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

        let userIdExitInCart= await cartModel.findOne({
            userId: userId
        })

        if(!userIdExitInCart){
            return res.status(404).send({
                status: false,
                message: "cart not exit by this userId"
            })
        }

        res.status(200).send({
            status: true,
            message: "cart detail successfully get",
            data: userIdExitInCart
        })
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

        let userIdExitInCart= await cartModel.findOne({
            userId: userId
        })

        if(!userIdExitInCart){
            return res.status(404).send({
                status: false,
                message: "cart not exit by this userId"
            })
        }

        userIdExitInCart.items= []
        userIdExitInCart.totalItems= 0
        userIdExitInCart.totalPrice= 0

        let deleteCart= await userIdExitInCart.save()

        res.status(204).send({
            status: false,
            message: "successfully deleted cart",
            data: deleteCart
        })
    } catch (error) {
        res.status(500).send({
            status: false,
            error: error.message
        })
    }
}


module.exports= {postCart, updateCart, getCart, deleteCart}