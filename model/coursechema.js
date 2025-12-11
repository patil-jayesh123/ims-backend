const mongoose=require('mongoose')
const courseschema=new mongoose.Schema({
    name:String,
    duration:String,
    instructor:String
})

module.exports = mongoose.model("courses",courseschema,"courses")