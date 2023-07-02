const userModel= require('../models/userModel')
const validator= require("validator")
const {isValid}= require("../validation/isvalid")
const {uploadFile}= require("../awss3/awsS3")
const bcrypt= require("bcrypt")
const jwt= require("jsonwebtoken")
require("dotenv").config()

const userRegister= async (req, res) => {
    try {
        let {fname, lname, email, phone, password, address}= req.body

        //validation for userdetail

        if(!isValid(fname) || !isValid(lname) || !isValid(email) || !isValid(phone) || !isValid(password)){
            return res.status(400).send({
                status: false,
                message: "please provide all detail"
            })
        }

        if(!isValid(address.shipping.street) || !isValid(address.shipping.city) || !isValid(address.billing.street) || !isValid(address.billing.city)){
            return res.status(400).send({
                status: false,
                message: "please provide valid address"
            }) 
        }

        if(!address.shipping.pincode && typeof address.shipping.pincode !== 'number'){
            return res.status(400).send({
                status: false,
                message: "please provide valid shipping pincode"
            }) 
        }

        if(!address.billing.pincode && typeof address.billing.pincode !== 'number'){
            return res.status(400).send({
                status: false,
                message: "please provide valid billing pincode"
            }) 
        }

        email= email.trim()
        if(!validator.isEmail(email)){
            return res.status(400).send({
                status: false,
                message: "please provide valid email"
            }) 
        }

        password= password.trim()
        if(password.length < 8 || password.length > 15){
            return res.status(400).send({
                status: false,
                message: "password length should be between 8 to 15"
            }) 
        }

        phone= phone.trim()
        if(!validator.isMobilePhone(phone)){
            return res.status(400).send({
                status: false,
                message: "please provide valid phone number"
            }) 
        }

        // aws S3

        let {profileImage}= req.files
        if(profileImage && profileImage.length > 0){
            let awss3link= uploadFile(profileImage[0])
            req.body.profileImage= awss3link
        }else{
            return res.status(400).send({
                status: false,
                message: "please provide valid profile image"
            }) 
        }

        //checking unique or not

        let emailAlreadyExit= await userModel.findOne({email: email})
        if(emailAlreadyExit){
            return res.status(400).send({
                status: false,
                message: "email already exit"
            }) 
        }

        let phoneAlreadyExit= await userModel.findOne({phone: phone})
        if(phoneAlreadyExit){
            return res.status(400).send({
                status: false,
                message: "phone already exit"
            }) 
        }

        //password bcrypt

        // Generate a salt
        const salt = await bcrypt.genSalt(10);
        
        // Hash the password with the salt
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Replace the plain text password with the hashed password
        password = hashedPassword;

        const userRegister= await userModel.create(req.body)

        res.status(201).send({
            status: true,
            message: "user created successfully",
            data: userRegister
        })

    } catch (error) {
        res.status(500).send({
            status: true,
            message: error.message
        })
    }
}

// ********************************************************************************** //

const userLogin= async (req, res) => {
    try {
        let {email, password}= req.body

        if(!isValid(email) || !isValid(password)){
            return res.status(400).send({
                status: false,
                message: "please provide valid email and password"
            })
        }

        //login verification
        const user = await userModel.findOne({email})     

        if(!user){
            return res.status(401).send({
              status : false, 
              message : "invalid email" 
            })
        }
        
        const databasePassword = user.password; // Get the stored hashed password from the user object in the database
        
        let match= bcrypt.compare(password, databasePassword)
        
        if(!match){
            return res.status(401).send({
                status : false, 
                message : "invalid password" 
            })
        }

        //generating jwt token

        const token = jwt.sign({userId : user._id}, process.env.SECRET_KEY)

        res.status(200).send({
          status : true,
          message: "user login successful", 
          data : {
            userId: user._id,
            token: token
        } 
        })
    } catch (error) {
        res.status(500).send({
            status: true,
            message: error.message
        })
    }
}

// ********************************************************************************** //

const getUser= async (req, res) => {
    try {
        let {userId}= req.params

        if(!isValid(userId)) return res.status(404)
        .send({
            status: false,
            message: 'please provide userId'
        })

        let userIdValid= mongoose.isValidObjectId(userId)
        if(!userIdValid) return res.status(400).send({
            status: false,
            message: 'please provide valid userId'
        })

        let userIdExit= await userModel.findOne({_id: userId}) 
        if(!userIdExit) return res.status(404).send({
            status: false,
            message: 'userId not exit'
        })

        res.status(200).send({
            status: true,
            message: "user profile details",
            data: userIdExit
        })
    } catch (error) {
        res.status(500).send({
            status: true,
            message: error.message
        })
    }
}

// ********************************************************************************** //

const updateUser= async (req, res) => {
    try {
        let {userId}= req.params

        if(!isValid(userId)) return res.status(404)
        .send({
            status: false,
            message: 'please provide userId'
        })

        let userIdValid= mongoose.isValidObjectId(userId)
        if(!userIdValid) return res.status(400).send({
            status: false,
            message: 'please provide valid userId'
        })

        let userIdExit= await userModel.findOne({_id: userId}) 
        if(!userIdExit) return res.status(404).send({
            status: false,
            message: 'userId not exit'
        })

        //authorization
        if(req["x-api-key"].userId != userIdExit._id){
            return res.status(403).send({
                status: false,
                message: "unauthorized, userId not same"
            })
        }

        //detail for updation
        let {fname, lname, email, phone, password, address}= req.body

        if(fname){
            if(!isValid(fname)){
                return res.status(400).send({
                    status: false,
                    message: "please provide fname"
                })
            }
            userIdExit.fname= fname
        }

        if(lname){
            if(!isValid(lname)){
                return res.status(400).send({
                    status: false,
                    message: "please provide lname"
                })
            }
            userIdExit.lname= lname
        }

        if(password){
            if(!isValid(password)){
                return res.status(400).send({
                    status: false,
                    message: "please provide password"
                })
            }
            password= password.trim()
            if(password.length < 8 || password.length > 15){
            return res.status(400).send({
                status: false,
                message: "password length should be between 8 to 15"
            }) 
            }
            //password bcrypt

            // Generate a salt
            const salt = await bcrypt.genSalt(10);
            
            // Hash the password with the salt
            const hashedPassword = await bcrypt.hash(password, salt);
            
            // Replace the plain text password with the hashed password
            userIdExit.password = hashedPassword;
        }

        if(email){
            if(!isValid(email)){
                return res.status(400).send({
                    status: false,
                    message: "please provide email"
                })
            }
            email= email.trim()
            if(!validator.isEmail(email)){
                return res.status(400).send({
                    status: false,
                    message: "please provide valid email"
                }) 
            }

            //checking unique or not
            let emailAlreadyExit= await userModel.findOne({email: email})
            if(emailAlreadyExit){
                return res.status(400).send({
                    status: false,
                    message: "email already exit"
                }) 
            }
            userIdExit.email= email
        }

        if(phone){
            if(!isValid(phone)){
                return res.status(400).send({
                    status: false,
                    message: "please provide phone"
                })
            }
            phone= phone.trim()
            if(!validator.isMobilePhone(phone)){
                return res.status(400).send({
                    status: false,
                    message: "please provide valid phone number"
                }) 
            }
            let phoneAlreadyExit= await userModel.findOne({phone: phone})
            if(phoneAlreadyExit){
                return res.status(400).send({
                    status: false,
                    message: "phone already exit"
                }) 
            }
            userIdExit.phone= phone
        }

        if(address.shipping.street){
            if(!isValid(address.shipping.street)){
                return res.status(400).send({
                    status: false,
                    message: "please provide address.shipping.street"
                })
            }
            userIdExit.address.shipping.street= address.shipping.street
        }

        if(address.shipping.city){
            if(!isValid(address.shipping.city)){
                return res.status(400).send({
                    status: false,
                    message: "please provide address.shipping.city"
                })
            }
            userIdExit.address.shipping.city= address.shipping.city
        }

        if(address.billing.street){
            if(!isValid(address.billing.street)){
                return res.status(400).send({
                    status: false,
                    message: "please provide address.billing.street"
                })
            }
            userIdExit.address.billing.street= address.billing.street
        }

        if(address.billing.city){
            if(!isValid(address.billing.city)){
                return res.status(400).send({
                    status: false,
                    message: "please provide address.billing.city"
                })
            }
            userIdExit.address.billing.city= address.billing.city
        }

        if(address.shipping.pincode){
            if(!address.shipping.pincode && typeof address.shipping.pincode !== 'number'){
                return res.status(400).send({
                    status: false,
                    message: "please provide valid shipping pincode"
                })
            }
            userIdExit.address.shipping.pincode= address.shipping.pincode
        }

        if(address.billing.pincode){
            if(!address.billing.pincode && typeof address.billing.pincode !== 'number'){
                return res.status(400).send({
                    status: false,
                    message: "please provide valid billing pincode"
                })
            }
            userIdExit.address.billing.pincode= address.billing.pincode
        }

        // aws S3

        let {profileImage}= req.files
        if(profileImage){
            if(profileImage && profileImage.length > 0){
                let awss3link= uploadFile(profileImage[0])
                userIdExit.profileImage= awss3link
            }
        }

        const updateUser= await userIdExit.save()

        res.status(200).send({
            status: true,
            message: "updated successfully",
            data: updateUser
        }) 
        
    } catch (error) {
        res.status(500).send({
            status: true,
            message: error.message
        })
    }
}

module.exports= {userRegister, userLogin, getUser, updateUser}

