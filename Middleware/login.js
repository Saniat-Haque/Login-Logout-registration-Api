
require('dotenv').config()
const User = require("../Model/model");
const bcrypt = require("bcrypt");
const jwt=require('jsonwebtoken')

const loginAccess = async (req, res, next) => {

  const authHeader=req.headers.authorization
    const { email, password } = req.body;

  try {
    if (!email) { 
      return res.status(400).json({ message: "Please provide the email" });
    }
    if (!password) {
      return res.status(400).json({ message: "Please provide the password" });
    }

    if(!authHeader || !authHeader.startsWith("Bearer")){
      return res.status(401).json({message:'Token required !'})
    }

    const token= authHeader.split(' ')[1];
    const decode= jwt.verify(token,process.env.JWT_PASS)
    const {id,name }=decode.payload

    try {
      const isExist= await User.findOne({_id:id,name:name})

      if(!isExist ){
        return res.status(404).json({message:'Token is not valid !'})
      }  

    } catch (error) {
      return res.status(500).json({error})
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

module.exports = loginAccess;
