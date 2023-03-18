require("dotenv").config()
const jwt=require("jsonwebtoken")
const User =require('../Model/model')
const jwtPassword=process.env.JWT_PASS

const jwtCheck=async(req,res,next)=>{

    const authHeader=req.headers.authorization
    if(!authHeader || !authHeader.startsWith("Bearer")){
        return res.status(401).json({message:'Token required !'})
    }
    
   try {
    const token= authHeader.split(' ')[1];
    const decode= jwt.verify(token,jwtPassword)
    const {id,name }=decode.payload
    const existUser= await User.findOne({_id:id,name:name})
    if(!existUser){
        return res.status(404).json({message:'Token is not valid !'})
    }
    next()
    
   } catch (error) {
    return res.status(404).json({message:"Token is not valids"})
   }  
}
module.exports=jwtCheck

