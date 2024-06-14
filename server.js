require('dotenv').config();
const express=require('express');
const appServer=express();
const mongoose=require('mongoose');
const path=require('path')
const adminRouter = require('./router/adminRouter');
const port=process.env.PORT||5500;
const flash=require('connect-flash');
const authRouter = require('./router/authRouter');
const session=require('express-session');
const adminModel = require('./model/adminModel');
const mongodb_session=require('connect-mongodb-session')(session);



appServer.set('view engine','ejs');
appServer.set('views','view');

appServer.use(express.urlencoded({extended:true}));
appServer.use(express.static(path.join(__dirname,'public')));
appServer.use(express.static(path.join(__dirname,'uploads')));

const session_store=new mongodb_session({
    uri:process.env.DB_URL,
    collection:'auth_session'
})

appServer.use(flash());

appServer.use(session({
    secret:'secret_key',
    resave: false,
    saveUninitialized:false,
    store:session_store
}))

// appServer.use(async(req,res,next)=>{
//     if(!req.session.user)
//         next();
//     else{
//     let userValue=await adminModel.findById(req.session.user._id);
//     if(userValue){
//         req.user=userValue;
//         next();
//     }
//     else
//     console.log('User not found');
//     }
// })

appServer.use(authRouter);
appServer.use(adminRouter);
mongoose.connect(process.env.DB_URL)
.then(res=>{
    appServer.listen(port,()=>{
        console.log(`Database and Server connected Succesfully at http://localhost:${port}/`);
    })
})
.catch(err=>{
    console.log('Error in creation of Data',err);
})