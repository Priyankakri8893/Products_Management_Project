const express= require('express')
const router= express.Router()
const {auth}= require("../middlewares/auth")
const {userRegister, userLogin, getUser, updateUser}= require("../controllers/userController")
const {postProduct, getProduct, getProductById, updateProduct, deleteProduct}= require("../controllers/productController")

router.post("/register", userRegister)
router.post("/login", userLogin)
router.get("/user/:userId/profile", getUser)
router.put("/user/:userId/profile", updateUser)

router.post("/products", postProduct)
router.get("/products", getProduct)
router.get("/products/:productId", getProductById)
router.put("/products/:productId", updateProduct)
router.delete("/products/:productId", deleteProduct)

module.exports= router