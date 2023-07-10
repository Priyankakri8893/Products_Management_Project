const express= require('express')
const router= express.Router()
const {auth}= require("../middlewares/auth")
const {userRegister, userLogin, getUser, updateUser}= require("../controllers/userController")
const {postProduct, getProduct, getProductById, updateProduct, deleteProduct}= require("../controllers/productController")
const {postCart, updateCart, getCart, deleteCart}= require("../controllers/cartController")
const {orders, updateOrders}= require('../controllers/orderController')

router.post("/register", userRegister)
router.post("/login", userLogin)
router.get("/user/:userId/profile", auth, getUser)
router.put("/user/:userId/profile", auth, updateUser)

router.post("/products", postProduct)
router.get("/products", getProduct)
router.get("/products/:productId", getProductById)
router.put("/products/:productId", updateProduct)
router.delete("/products/:productId", deleteProduct)

router.post("/users/:userId/cart", auth, postCart)
router.put("/users/:userId/cart", auth, updateCart)
router.get("/users/:userId/cart", auth, getCart)
router.delete("/users/:userId/cart", auth, deleteCart)

router.post("/users/:userId/orders", auth, orders)
router.put("/users/:userId/orders", auth, updateOrders)

module.exports= router