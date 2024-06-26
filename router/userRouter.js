const express=require('express');
const { showDetails, removeData } = require('../controller/userController');
const userRouter=express.Router();

userRouter.get('/details/:id',showDetails);
userRouter.get('/remove/:id',removeData);


module.exports=userRouter;