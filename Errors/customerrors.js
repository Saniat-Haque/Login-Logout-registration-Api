class CustomApiErrors extends Error{
    constructor(message,statuscode){
        super(message)
        this.statuscode=statuscode
    }
}

const customErrors=(message,statuscode)=>{
    return new CustomApiErrors(message,statuscode)
}
module.exports={customErrors,CustomApiErrors}