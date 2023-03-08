require('dotenv').config()
const User = require("../Model/model");
const jwt=require('jsonwebtoken')
const bcrypt = require("bcrypt");

const changePassword=async(req,res)=>{
    try {
        const authHeader=req.headers.authorization
        const {oldpassword,newpassword,renewpassword}=req.body

        if (!oldpassword || !newpassword || !renewpassword) {
            return res.status(401).json({message:"Please feild the requirement !"})
        }

        if (newpassword !== renewpassword) {
            return res.status(300).json({message:'Password does not match !'})
        }

        if (!authHeader || !authHeader.startsWith("Bearer")) {
            return res.status(404).json({message:'Token required !'})
        }

        const token= authHeader.split(' ')[1];
        const decode= jwt.verify(token,process.env.JWT_PASS)
        const {id,name }=decode.payload

        const existUser= await User.findOne({_id:id,name:name})
        if(!existUser){
            return res.status(404).json({message:'Token is not valid !'})
        }

        try {
            const existPassword=existUser.password
            const result = await bcrypt.compare(oldpassword, existPassword);  
            if(!result){
                return res.status(404).json({message:'Old password is incorrect '})
            } 

            try {
                const hashedPassword = await bcrypt.hash(newpassword, 10);
                const updatedUser = await User.findOneAndUpdate(
                    { _id: id },
                    { password: hashedPassword },
                    { new: true }
                );    
                res.status(201).json({message:'Password changed'})

            } catch (error) {
                return res.status(500).json({error})
            }

        } catch (error) {
            return res.status(500).json({message:error})
        }
    } catch (error) {
        res.status(500).json({error})
    }  
}
module.exports=changePassword