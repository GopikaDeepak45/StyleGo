const express=require('express')
const   Router=express.Router()
const userController=require('../controllers/userController')


Router.get('/',userController.getHome)
Router.get('/shop',userController.getShop)
//Router.get('/contact',userController.getContact)
Router.get('/login',userController.getLogin)
Router.post('/login',userController.postLogin)
Router.post('/otp',userController.postOtp)
Router.post('/resend',userController.postResend)
Router.get('/signUp',userController.getSignUp)
Router.post('/signUp',userController.postSignUp)

module.exports=Router;