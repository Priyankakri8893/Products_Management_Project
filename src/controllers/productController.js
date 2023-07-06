const productModel= require("../models/productModel")
const validator= require("validator")
const {isValid}= require("../validation/isvalid")
const {uploadFile}= require("../awss3/awsS3")
const { default: mongoose } = require("mongoose")

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

const getProduct = async (req, res) => {
    try {
      let { size, name, priceGreaterThan, priceLessThan, priceSort } = req.query;
  
      let filters = { isDeleted: false };
  
      if (name) {
        filters.title = { $regex: name, $options: "i" };
      }
  
      if (size) {
        filters["availableSizes"] = { $in: size.split(",") };
      }
  
      if (priceGreaterThan) {
        filters.price = { $gt: parseInt(priceGreaterThan) };
      }
  
      if (priceLessThan) {
        if (filters.price) {
          filters.price.$lt = parseInt(priceLessThan);
        } else {
          filters.price = { $lt: parseInt(priceLessThan) };
        }
      }
  
      let sortOption = {};
      if (priceSort) {
        sortOption.price = parseInt(priceSort);
      }
  
      const products = await productModel.find(filters).sort(sortOption);

      if(products.length === 0){
        return res.status(404).send({
            status: false,
            message: "product not found"
        })
      }
  
      res.status(200).send({
        status: true,
        message: "product successfully find",
        data: products
      });
    } catch (error) {
      res.status(500).send({
        status: false,
        message: error.message,
      });
    }
  };
  

// ********************************************************************************** //

const getProductById= async (req, res) => {
    try {
        let {productId}= req.params

        if(!isValid(productId)) return res.status(404)
        .send({
            status: false,
            message: 'please provide productId'
        })

        if(!mongoose.isValidObjectId(productId)){
            return res.status(400).send({
                status: false,
                message: "please provide valid productId"
            })
        }

        let productIdExit= await productModel.findOne({_id: productId, isDeleted: false}) 
        if(!productIdExit) return res.status(404).send({
            status: false,
            message: 'productId not exit'
        })
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
        let {productId}= req.params

        //productId verify
        if(!isValid(productId)) return res.status(404)
        .send({
            status: false,
            message: 'please provide productId'
        })

        let productIdValid= mongoose.isValidObjectId(productId)
        if(!productIdValid) return res.status(400).send({
            status: false,
            message: 'please provide valid productId'
        })

        let productIdExit= await productModel.findById({_id: productId}) 

        if(!productIdExit) return res.status(400).send({
            status: false,
            message: 'productId not exit'
        })

        //update detail verify and add 
        let {title, description, price, currencyId, currencyFormate, 
            style, availableSizes, installments}= req.body

        if(title){
            if(!isValid(title)){
                return res.status(400).send({
                    status: false,
                    message: "provide valid title"
                })
        }

        let titleAlreadyExit= await productModel.findOne({title: title})
        if(titleAlreadyExit){
            return res.status(400).send({
                status: false,
                message: "title already exit"
            }) 
        }

        productIdExit.title= title
    }

    if(description){
        if(!isValid(description)){
            return res.status(400).send({
                status: false,
                message: "provide valid description"
            })
    }
    
    productIdExit.description= description
    }

    if(price){
        if(!price || typeof price !== "number"){
            return res.status(400).send({
                status: false,
                message: "provide price"
            })
        }
    
    productIdExit.price= price
    }

    if(currencyId){
        if(!isValid(currencyId)){
            return res.status(400).send({
                status: false,
                message: "provide valid currencyId"
            })
    }
    
    productIdExit.currencyId= currencyId
    }

    if(currencyFormate){
        if(!isValid(currencyFormate)){
            return res.status(400).send({
                status: false,
                message: "provide valid currencyFormate"
            })
    }
    
    productIdExit.currencyFormate= currencyFormate
    }

    if(style){
        if(!isValid(style)){
            return res.status(400).send({
                status: false,
                message: "provide valid style"
            })
    }
    
    productIdExit.style= style
    }

    if(installments){
        if(typeof installments !== "number"){
            return res.status(400).send({
                status: false,
                message: "provide valid installments"
            })
        }

        productIdExit.installments= installments
    }

    if(availableSizes){
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

        productIdExit.availableSizes= availableSizes
    }

    // aws S3

    let {productImage}= req.files

    if(productImage){
        if(productImage && productImage.length > 0){
            let awss3link= uploadFile(productImage[0])
            productIdExit.productImage= awss3link
        }else{
            return res.status(400).send({
                status: false,
                message: "please provide valid profile image"
            }) 
        }
    }

    const updateProduct= await productIdExit.save()

        res.status(200).send({
            status: true,
            message: "product is successfully update",
            data: updateProduct
        })
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
        let {productId}= req.params

        if(!isValid(productId)){
            return res.status(404).send({
                status: false,
                message: "product id is invalid"
            })
        }

        if(!mongoose.isValidObjectId(productId)){
            return res.status(400).send({
                status: false,
                message: "productId is not valid"
            })
        }

        let product= await productModel.findOne({
            _id: productId, isDeleted: false
        })

        if(!product){
            return res.status(404).send({
                status: false,
                message: "productId not exit"
            })
        }

        product.isDeleted= true

        await product.save()

        res.status(200).send({
            status: false,
            message: "product is deleted successfully",
            data: ""
        })
    } catch (error) {
        res.status(500).send({
            status: false,
            message: error.message
        })
    }
}


module.exports= {postProduct, getProduct, getProductById, updateProduct, deleteProduct}