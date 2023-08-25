const  User=require('../models/user/user')
const bcrypt=require('bcrypt')
const helpers=require('../helpers/user/signIn-signUp')

//to get data from login route to otp
let userFromLogin=null

//get Home
const getHome=(req,res)=>{
    res.render('user/home',{layout:false})
}
//get Shop
const getShop=(req,res)=>{
    res.render('user/shop',{layout:'./layout/user-main'})
}
//get Contact
const getContact=(req,res)=>{
    res.render('user/contact',{layout:'./layout/user-main'})
}
//get login
const getLogin=(req,res)=>{
    res.render('user/login',{layout:'./layout/user-main'})
}
//post login
const postLogin=async(req,res)=>{
    const {email,password}=req.body

    try{
        const userData=await User.findOne({email})

        if(userData){
            const isMatchPassword=await bcrypt.compare(password,userData.password)
            const isUnblocked=!(userData.isBlocked)

            if(isMatchPassword){
                //if username ,password match check if blocked or not
                if(isUnblocked){
                    //generate otp and mail data
                    const otp=Math.floor(100000+Math.random()*900000).toString()
                    const sub='Login OTP'
                    const msg=`Your OTP for Login : ${otp}`
                    //save otp to user
                    userData.otp=otp
                    await userData.save()
                    //save to get in otp route
                    userFromLogin=userData
                    //send email
                    try{
                        helpers.sendEmail(email,sub,msg)
                        res.render('user/otp',{layout:false})
                    }catch(error){
                        console.log('Error in sending mail',error)
                        res.status(500).json({error:'Internal Server Error'})
                    }
                }else{
                    res.render('user/login',{layout:'./layout/user-main',error:{message:'Account blocked by the admin'}})
                }
            }else{
                res.render('user/login',{layout:'./layout/user-main',error:{message:'Incorrect username or password'}})
            }
        }else{
            res.render('user/login',{layout:'./layout/user-main',error:{message:'Incorrect username or password'}})
        }
    }catch(e){
        console.log('post login error',e.message)
    }
    
 
}

//post otp
const postOtp=async(req,res)=>{
    const {num1,num2,num3,num4,num5,num6}=req.body
    const otpToValidate=num1+num2+num3+num4+num5+num6
    
    if(otpToValidate===userFromLogin.otp){
        res.render('user/home',{layout:'./layout/user-main'})
    }else{
        res.render('user/otp',{layout:false,error:{message:'Invalid Otp'}})
    } 
}
//post resend

const postResend=async(req,res)=>{
    console.log('inside post resend')
    //generate otp and mail data
    const otp=Math.floor(100000+Math.random()*900000).toString()
    const email=userFromLogin.email
    const sub='Login OTP'
    const msg=`Your OTP for Login : ${otp}`
    //save otp to user
    userFromLogin.otp=otp
    await userFromLogin.save()
    
    //send email
    try{
        helpers.sendEmail(email,sub,msg)
        res.render('user/otp',{layout:false})

    }catch(error){
        console.log('Error in sending mail',error)
        res.status(500).json({error:'Internal Server Error'})
    }
}
//get signup
const getSignUp=(req,res)=>{
    res.render('user/signUp',{layout:'./layout/user-main',errors:null})
}

//post signUp
const postSignUp=async(req,res)=>{
    let errors={}
    let signedUser
    try{
        let{fullName,email,mobileNo,password,repeatPassword}=req.body

        //validate full name
        const nameError=helpers.validateName(fullName)
        if(nameError!==undefined)
        errors.fullName=nameError
                
        //validate mobile no
        const numError=helpers.validateNo(mobileNo)
        if(numError!==undefined)
        errors.mobileNo=numError
          
        //validate password 
        const passError=helpers.validatePassword(password)
        if(passError!==undefined){
            errors.password=passError
        }

        //validate repeat password
        if(password!==repeatPassword){
            errors.repeat={message:"Password didn't match"}
        }
        //hash the password 
        const secPassword=await helpers.securePassword(password)

        const newUser=new User({fullName,email,password:secPassword,mobileNo})
        signedUser=newUser

        if (Object.keys(errors).length > 0) {
            // If there are errors, render the signup page with all validation errors
            console.log(errors)
            res.render('user/signUp',{layout:'./layout/user-main',errors,formData:newUser});
        }else{
            await newUser.save()
            .then((data)=>{
                req.session.authenticated=true
                req.session.user=data
            
            })
            res.redirect('/');
        }
    } catch (error) {
          // Handle other errors, e.g., MongoDB connection error
          //email already exists
          if(error.code===11000){
            errors.email={message:'Email already exists'}
            res.render('user/signUp',{layout:'./layout/user-main',errors,formData:signedUser});
          }
          else
          res.status(500).send('Internal Server Error');
    }
}
 
module.exports={
    getHome,
    getShop,
    getContact,
    getLogin,
    postLogin,
    postOtp,
    postResend,
    getSignUp,
    postSignUp
}