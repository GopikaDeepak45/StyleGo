const mongoose=require('mongoose')
const valiadtoe=require('validator')

const userSchema= new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        
      },
      email: {
        type: String,
        required: true,
        unique:true,
       
      },
      password: {
        type: String,
        required: true,
        minlength:8,
        
      },
      mobileNo:{
        type: String,
        required: true,
        
      },
      address:{
        type:String,
        required:false,
        trim:true
    },
    city:{
        type:String,
        required:false
    },
    state:{
        type:String,
        required:false
    },
    zip:{
        type:String,
        required:false
    },
    country:{
        type:String,
        required:false
    },
    isBlocked:{
        type:Boolean,
        default:false
    },
    otp:{
      type:String
    }
})

module.exports=mongoose.model("User",userSchema)