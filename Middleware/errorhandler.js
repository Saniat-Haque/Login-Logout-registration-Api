const {CustomApiErrors}=require('../Errors/customerrors')

const errorHandler=(err,req,res,next)=>{
    if(err instanceof CustomApiErrors){
        return res.status(err.statuscode).json({msg:err.message})
    }
    return res.status(500).json({msg:`Something went wrong !, Try again latter`})
}
module.exports=errorHandler