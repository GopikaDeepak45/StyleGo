const express=require('express')


//creae express app

const app=express()

//api
app.get('/',(req,res)=>{
    res.send('hiiiiii')
})

//listen to port
app.listen(3000)