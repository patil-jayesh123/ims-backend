const express=require('express')
const app=express()
//-------------------------------------------------------------
//import db
const connection=require('./config/db')
const adminschema=require('./model/adminschema')
const studentschema=require('./model/studentschem')
const staffschema=require('./model/staffschema')
//-------------------------------------------------------------
//middeleware
app.use(express.json())
app.use(express.static('public/'))
app.use(express.urlencoded({extended:true}))
//-------------------------------------------------------------
//import cors
var cors=require('cors')
app.use(cors())

//-------------------------------------------------------------
//import route
const user=require('./Route/user')
app.use('/',user)

const admin=require('./Route/admin')
app.use('/admin',admin)

//-------------------------------------------------------------
const PORT=2000
const HOST='0.0.0.0'

app.listen(PORT,HOST,()=>{
    console.log(`server is running on http://${HOST}:${PORT}`);    
})