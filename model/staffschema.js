const mongoose=require('mongoose')
const staffschema= new mongoose.Schema({
    name:String,
    department:String,
    email:String
})

module.exports=mongoose.model('staff',staffschema,'staff')