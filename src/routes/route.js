const express= require('express')
const router= express.Router()
const {auth}= require("../middlewares/auth")
const {userRegister, userLogin, getUser, updateUser}= require("../controllers/userController")
const {postProduct, getProduct, getProductById, updateProduct, deleteProduct}= require("../controllers/productController")
const {postCart, updateCart, getCart, deleteCart}= require("../controllers/cartController")

router.post("/register", userRegister)
router.post("/login", userLogin)
router.get("/user/:userId/profile", getUser)
router.put("/user/:userId/profile", updateUser)

router.post("/products", postProduct)
router.get("/products", getProduct)
router.get("/products/:productId", getProductById)
router.put("/products/:productId", updateProduct)
router.delete("/products/:productId", deleteProduct)

router.post("/users/:userId/cart", postCart)
router.put("/users/:userId/cart", updateCart)
router.get("/users/:userId/cart", getCart)
router.delete("/users/:userId/cart", deleteCart)

module.exports= router