require('dotenv').config()
const express=require('express')
const connectedToTheDatabase=require('./Database/databse')
const mainRoute=require('./Routes/routes')
const {loginAccess,changePassword}=require('./Controller/controller')
const jwtCheck=require('./Middleware/jwtauth')


const app=express()
app.use(express.json());
const port =process.env.PORT || 3000;


app.use('/create',mainRoute);
app.use('/change',jwtCheck,changePassword)
app.use('/login',jwtCheck,loginAccess);




const start= async()=>{
     await connectedToTheDatabase()
     app.listen(port,(error)=>{
        
        if(error){
            console.log(error);
        }else{
            console.log(`SERVER RUNNING ON : ${port}`);
        }
    })
} 

start()