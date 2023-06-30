const express= require("express")
const route= require("./routes/route")
const { default: mongoose } = require("mongoose")

const multer= require("multer");
const { AppConfig } = require('aws-sdk');

const app= express()

app.use( multer().any())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

require("dotenv").config()


mongoose.connect(process.env.MONGO_URI)
.then( () => console.log("mongodb is connected"))
.catch( (err) => console.log(err.message))

app.use('/', route)

app.listen(process.env.PORT, () => {
    console.log(`express app is running on port ${process.env.PORT}`)
})