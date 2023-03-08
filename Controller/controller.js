require('dotenv').config()
const User=require('../Model/model')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')

const createUser = async(req,res)=>{
    try {
        const {name,email,password}= req.body
        if (!name) {
            return res.status(201).json({message:"Please provide the name"})
        }
        if(!email){
            return res.status(201).json({message:"Please provide the email"})
        }
        if(!password){
            return res.status(201).json({message:"Please provide the password"})
        }

        
        const existingEmailCheck= await User.findOne({email:req.body.email})
        if (existingEmailCheck) {
            return res.status(500).json({message:'Email already exists'})
        }

        const hashedPassword= await bcrypt.hash(req.body.password,10)

        const user=await new User({
            name:req.body.name,
            email:req.body.email,
            password:hashedPassword
        });
        await user.save();
        
        try {
            const savedUser = await User.findOne({email:email});
            const userId = savedUser._id;

            const payload =  { id:userId.toString(),name:savedUser.name} 

            const token= jwt.sign({payload},process.env.JWT_PASS,{expiresIn:'30d'})

             const decode = jwt.verify(token,process.env.JWT_PASS)
             const {id,name}=decode.payload
           return res.status(201).json({message:` registered successfull. Wellcome ${name}`,token}) 
            
        } catch (error) {
            res.status(500).json({error})
        }
            
   
    } catch (error) {
        res.status(500).json({error})
    }  
}

module.exports=createUser
