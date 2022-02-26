const express = require("express")
const router = express.Router()
const signUpTemplateCopy = require('../models/SignUpModels')
const mongoose = require('mongoose')
const { response, request } = require("express")
const SignUpModels = require("../models/SignUpModels")
const mongoDB = "mongodb+srv://yqi_2002:Yuxuan02@cluster0.22647.mongodb.net/mytable?retryWrites=true&w=majority"
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});
const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

db.once("open", function() {
    console.log("MongoDB database connection established successfully");
  });

router.post('/usercheck', (request, response) => {
    const userName_get = request.body.userName;
    signUpTemplateCopy.findOne({userName: userName_get})
    .then(data => {
        response.json(data)
    })
    .catch(error => {
        response.json(error)
    })
});

router.post('/signup', async (request, response) => {
    const signedUpUser = new signUpTemplateCopy({
        userName:request.body.userName,
        password:request.body.password,
        phoneNumber: request.body.phoneNumber,
        finished_order_number: request.body.finished_order_number,
        rating: request.body.rating
    })

    signedUpUser.save()
    .then(data => {
        response.json(data)
    })
    .catch(error => {
        response.json(error)
    })
});

module.exports = router