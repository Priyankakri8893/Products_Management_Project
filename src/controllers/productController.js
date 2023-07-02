const productModel= require("../models/productModel")
const validator= require("validator")
const {isValid}= require("../validation/isvalid")
const {uploadFile}= require("../awss3/awsS3")

const postProduct= async (req, res) => {
    try {
        let {title, description, price, currencyId, currencyFormate, 
            style, availableSizes, installments}= req.body

        //check detail is valid or not
        if(!isValid(title) || !isValid(description) || !isValid(currencyFormate) || !isValid(currencyId)){
            return res.status(400).send({
                status: false,
                message: "provide valid detail"
            })
        }//recheckhere

        if(!price || typeof price !== "number"){
            return res.status(400).send({
                status: false,
                message: "provide price"
            })
        }

        if(style){
            if(typeof style !== "string"){
                return res.status(400).send({
                    status: false,
                    message: "provide valid style"
                })
            }
        }

        if(installments){
            if(typeof installments !== "number"){
                return res.status(400).send({
                    status: false,
                    message: "provide valid installments"
                })
            }
        }
        
        if(!availableSizes || typeof availableSizes !== "object"){
            return res.status(400).send({
                status: false,
                message: "provide at least one availableSizes"
            })
        }

        let productSize= ["S", "XS","M","X", "L","XXL", "XL"]
        for(let i=0; i<availableSizes.length; i++){
            if(!productSize.includes(availableSizes[i])){
                return res.status(400).send({
                    status: false,
                    message: "provide valid size"
                })
            }
        }

        // aws S3

        let {productImage}= req.files
        if(productImage && productImage.length > 0){
            let awss3link= uploadFile(productImage[0])
            req.body.productImage= awss3link
        }else{
            return res.status(400).send({
                status: false,
                message: "please provide valid profile image"
            }) 
        }

        //checking unique or not

        let titleAlreadyExit= await productModel.findOne({title: title})
        if(titleAlreadyExit){
            return res.status(400).send({
                status: false,
                message: "title already exit"
            }) 
        }

        const postProduct= await productModel.create(req.body)

        res.status(201).send({
            status: true,
            message: "product is successfully post",
            data: postProduct
        })
    } catch (error) {
        res.status(500).send({
            status: false,
            message: error.message
        })
    }
}

// ********************************************************************************** //

const getProduct= async (req, res) => {
    try {
        
    } catch (error) {
        res.status(500).send({
            status: false,
            message: error.message
        })
    }
}

// ********************************************************************************** //

const getProductById= async (req, res) => {
    try {
        
    } catch (error) {
        res.status(500).send({
            status: false,
            message: error.message
        })
    }
}

// ********************************************************************************** //

const updateProduct= async (req, res) => {
    try {
        
    } catch (error) {
        res.status(500).send({
            status: false,
            message: error.message
        })
    }
}

// ********************************************************************************** //

const deleteProduct= async (req, res) => {
    try {
        
    } catch (error) {
        res.status(500).send({
            status: false,
            message: error.message
        })
    }
}


module.exports= {postProduct, getProduct, getProductById, updateProduct, deleteProduct}