require('dotenv').config()
const mongoose =require('mongoose')
const url=process.env.URL;

const connectedToTheDatabase=()=>{
    return mongoose.connect(url).then(console.log("CONNECTED TO THE DATABASE"));
    
}


module.exports=connectedToTheDatabase