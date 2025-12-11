const express=require('express')
const Router=express.Router()

Router.get('/',(req,res)=>{
    res.send('<h1>user route</h1>')
})

module.exports=Router