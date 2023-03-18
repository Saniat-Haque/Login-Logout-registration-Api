require('dotenv').config()
const User=require('../Model/model')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')

const jwtPassword=process.env.JWT_PASS




//======== REGISTER ==========

const createUser = async(req,res)=>{
    try {
        const {name,email,password}= req.body

        if (!name || !email || !password) {
            return res.status(201).json({message:"All feild are required"})
            
        }
    
        const existingEmailCheck= await User.findOne({email:req.body.email})
        if (existingEmailCheck) {
            return res.status(500).json({message:'User already exists'})
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
            const token= jwt.sign({payload},jwtPassword,{expiresIn:'30d'})
            const decode = jwt.verify(token,jwtPassword)
            const {id,name}=decode.payload
            return res.status(201).json({message:` Registered successfully. Wellcome ${name}`,token}) 
       
        } catch (error) {
            res.status(500).json({error})
        }
            
   
    } catch (error) {  
        res.status(500).json({error})
    }  
}


//========= LOGIN =============

const loginAccess = async (req, res) => {
    const { email, password } = req.body;

    try {
          if (!email || !password  ) { 
            return res.status(400).json({ message: "Please provide all the thing " });
      }

    const existUser = await User.findOne({ email: email });
          if (!existUser) {
            return res.status(404).json({ message: "User not found!" });
      }
  
    const result = await bcrypt.compare(password, existUser.password);
          if (result) {
            return res.status(200).json({ message: `wellcome ${existUser.name}`});
      } else {
            return res.status(401).json({ message: "User not found" });
      }

    } catch (error) {
            return res.status(500).json({ message: error.message });
    }
  };

//============== PASSWORD CHANGEING =======================

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

        const token= authHeader.split(' ')[1];
        const decode= jwt.verify(token,process.env.JWT_PASS)
        const {id,name }=decode.payload
        const existUser= await User.findOne({_id:id,name:name})
        
        try {
        const existPassword=existUser.password
        const result = await bcrypt.compare(oldpassword, existPassword);  
        
            if(!result){
                return res.status(404).json({message:'Incorrect old password'})
            } 

            try {
                const hashedPassword = await bcrypt.hash(newpassword, 10);
                await User.findOneAndUpdate(        //const updatedUser =
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

module.exports={createUser,changePassword,loginAccess}
