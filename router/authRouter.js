const express=require('express');
const { viewRegister, postRegister, con_mail, viewLogin, postLogin, forgetPassword, con_user, viewPassword, changePassword, logout } = require('../controller/authController');
const authRouter=express.Router();


authRouter.get('/register',viewRegister);
authRouter.post('/postRegister',postRegister);

authRouter.get('/verifyMail/:email/:jwt',con_mail);

authRouter.get('/login',viewLogin);
authRouter.post('/postLogin',postLogin);

authRouter.get('/forgetpassword/emailVerify',forgetPassword);
authRouter.post('/forgetpassword',con_user);

authRouter.get('/newpassword/:email',viewPassword);
authRouter.post('/postNewPassword',changePassword);

authRouter.get('/logout',logout);

module.exports=authRouter;