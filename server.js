const express=require('express')
const expressLayouts=require('express-ejs-layouts')
const path=require('path')


//creae express app
const app=express()

//use layouts middleware
app.use(expressLayouts)

//set view engine
app.set('view engine','ejs')

app.use(express.static(path.join(__dirname,'public')))



//api
app.get('/',(req,res)=>{
    res.render('user/home',{layout:'./layout/user-main'})
})
app.get('/shop',(req,res)=>{
    res.render('user/shop',{layout:'./layout/user-main'})
})
app.get('/login',(req,res)=>{
    res.render('user/login',{layout:'./layout/user-main'})
})
app.get('/signUp',(req,res)=>{
    res.render('user/sign-up',{layout:'./layout/user-main'})
})
app.get('/forgot',(req,res)=>{
    res.render('user/forgot-password',{layout:'./layout/user-main'})
})
app.get('/detail',(req,res)=>{
    res.render('user/product-detail',{layout:'./layout/user-main'})
})
//listen to port
app.listen(3000,()=>{
    console.log('App is running on url http://localhost:3000')
})