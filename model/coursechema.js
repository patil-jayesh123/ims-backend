const mongoose=require('mongoose')
const courseschema=new mongoose.Schema({
    name:String,
    duration:String,
    instructor:String,
    isPublic: { type: Boolean, default: false }
})

module.exports = mongoose.model("courses",courseschema,"courses")