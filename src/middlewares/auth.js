const userModel= require('../models/userModel')
const jwt= require("jsonwebtoken")
require("dotenv").config()


const auth= async (req, res, next) => {
    try {
        const token= req.header("Authorization");
        if(!token){
            return res.status(401).send({
                status: false,
                message: 'Unauthorized'
            })
        }

        jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
            if(err){return res.status(403).send({
                status: false,
                message: 'Unauthorized'
            })}else{
                const userId= await userModel.findById(decoded.userId)
                if(!userId){
                    return res.status(401).send({
                        status: false,
                        message: 'user not login'
                    })
                }
                req['x-api-key']= decoded
                next()
            }
        })
    } catch (error) {
        res.status(500).send({
            status: false,
            error: error.message
        })
    }
}

module.exports= {auth}