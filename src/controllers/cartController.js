const cartModel= require("../models/cartModel")
const {isValid}= require("../validation/isvalid")


const postCart= async (req, res) => {
    try {
        
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