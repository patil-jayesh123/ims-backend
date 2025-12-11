const mongoose=require('mongoose')
const connection = async()=>{
    try{
        await mongoose.connect('mongodb+srv://jayeshpatilAtlas:Jayu8262@cluster0.9in5uyp.mongodb.net/IMS')
        console.log("DB connected......"+mongoose.connection.readyState)
    }catch(err){
        console.log(err);
        console.log('filedto connect DB...'+mongoose.connection.readyState);
    }
}

connection()
module.exports=connection