const mongoose=require('mongoose')
const User=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Must provide the name'],
        trim:true,
    },
    email:{
        type:String,
        required:[true,'Must provide email'],
        unique:true,
    },
    password:{
        type:String,
        required:[true,'Must porvide password']
    }
});


module.exports=mongoose.model('api',User)
