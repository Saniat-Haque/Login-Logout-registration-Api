require('dotenv').config()
const express=require('express')
const connectedToTheDatabase=require('./Database/databse')
const mainRoute=require('./Routes/routes')
const login=require('./Middleware/login')
const app=express()
app.use(express.json());
const port =process.env.PORT || 3000;

app.use('/create',mainRoute);
app.use('/login',login)


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