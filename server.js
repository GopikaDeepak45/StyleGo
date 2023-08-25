const express=require('express')
const expressLayouts=require('express-ejs-layouts')
const path=require('path')
const connectDb=require('./models/db')
const session=require('express-session')
const cookieParser=require('cookie-parser')


const PORT=process.env.PORT||3000

const userRoutes=require('./routes/userRoutes')

//creae express app
const app=express()

//use layouts middleware
app.use(expressLayouts)

//set view engine
app.set('view engine','ejs')
app.use(express.static(path.join(__dirname,'public')))


//db connecection
connectDb();
//parsing
app.use(express.json())
app.use(express.urlencoded({extended:true}))

//session and cookies

//app.use(nocache());

app.use(session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
}))
app.use((req,res,next)=>{
    res.locals.session=req.session
    next()
})

// app.use((req,res,next)=>{
//     if(req.session && req.session.authenticated){
//         res.locals.isAuthenticated=true;
//         res.locals.userName='malu';
//     }
//     console.log('locals',res.locals.userName)
//     next()
// })
app.use(cookieParser());

//parse json
app.use(express.json())
app.use(express.urlencoded({extended:true}))

//for user login check


//routes
app.use('/',userRoutes)

//listen to port
app.listen(PORT,()=>{
    console.log(`App is running on url http://localhost:${PORT}`)
})