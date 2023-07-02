const express= require('express')
const router= express.Router()
const {auth}= require("../middlewares/auth")
const {userRegister, userLogin, getUser, updateUser}= require("../controllers/userController")

router.post("/register", userRegister)
router.post("/login", userLogin)
router.get("/user/:userId/profile", getUser)
router.put("/user/:userId/profile", updateUser)

module.exports= router