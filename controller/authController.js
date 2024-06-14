const authModel = require("../model/authModel");
const bcrypt=require('bcryptjs');
const nodemailer=require('nodemailer');
const jwt=require('jsonwebtoken');
const tokenModel = require("../model/tokenModel");

const transport=nodemailer.createTransport({
    host:'stmp',
    port:465,
    secure:false,
    requireTLS:true,
    service:'gmail',
    auth:{
        user:'taufikur1999@gmail.com',
        pass:'acxp ilhm fycs fiuv'
    }
})

const viewRegister=(req,res)=>{
    res.render('auth/registration',{
        title: 'Registration Page'
    })
}

const postRegister=async(req,res)=>{
    try{
        // console.log('Details',req.body);
        let user_data=await authModel.findOne({email:req.body.email});
        if(!user_data){
            if(req.body.pass===req.body.con_pass){
                const hashpass=await bcrypt.hash(req.body.pass,12);
                console.log('Hash password',hashpass);
                let formData=await authModel({
                    email:req.body.email,
                    password:hashpass
                })
                let saved=await formData.save();
                if(saved){
                    res.render('misc/emailVerify',{
                        title: 'Email Verification'
                    })
                    const token_jwt=jwt.sign(
                        {email:req.body.email},
                        'secretKeyqwertyytrewq@qwertysecretkey',
                        {expiresIn:'1h'}
                    )
                    // console.log('Token',token_jwt);
                    const tokenData=new tokenModel({
                        _userId:saved._id,
                        token:token_jwt
                    })
                    let token_saved=await tokenData.save();
                    if(token_saved){
                        let mailOptions={
                            from:'taufikur1999@gmail.com',
                            to:req.body.email,
                            subject:'Email Verification',
                            text:'Hello ' + req.body.email+'\n\n'+
                            'Your registration Done Successfully'+'\n\nPlease Confirm your email below'+
                            '\n\n http://'+req.headers.host+'/verifyMail/'+req.body.email+"/"+token_jwt+'\n\nThank You'
                        }
        
                        transport.sendMail(mailOptions,function(err,info){
                            if(err){
                                console.log('Error to send mail',err);
                                res.redirect('/');
                            }
                            else{
                                console.log('Email sent',info.response);
                                // res.redirect('/login');
                            }
                        })
                    }
                }
                
            }
            else{
                console.log('Password do not match');
                req.flash('error','Password do not match');
            }
        }
        else{
            console.log('Email already exists');
            req.flash('error','email already exists');
        }
    }
    catch(err){
        console.log('Error in saving data',err);
    }
}

const con_mail=async(req,res)=>{
    try{
      // console.log(req.params.email);
    //   console.log(req.params.jwt);
      const user_data=await authModel.findOne({'email':req.params.email});
      const token_Data=await tokenModel.findOne({token:req.params.jwt});
      console.log(token_Data);
      // console.log('User data',user_data);
      if(token_Data){
        if(user_data.isVerified){
            console.log('User already Verified');
          //   res.redirect('/login');
        }
        else{
            user_data.isVerified=true;
            let save_verify=await user_data.save();
            if(save_verify){
                console.log('Account Succesfully Verified');
                res.redirect('/register')
            }
        }
    }
    else{
        console.log('Link Expires');
        res.redirect('/register')
    }  
    }
    catch(err){
     console.log('Error in Verification',err);
    }
}

const viewLogin=(req,res)=>{
    res.render('auth/login',{
        title: 'Login Page'
    })
}

const postLogin=async(req,res)=>{
    try {
        //    console.log("For login",req.body);
        const user_data = await authModel.findOne({ email: req.body.email });
        // console.log('user_data',user_data);
        if (user_data) { 
            const hasspass = await bcrypt.compare(req.body.pass, user_data.password)
            //    console.log('hasspass', hasspass);
            if (hasspass) {
                req.session.isLoggedIn = true;
                req.session.user = user_data;
                await req.session.save(err=>{
                    if(err)
                        console.log('Error in login',err);
                    else{
                        console.log('Login Successfully');
                        res.redirect('/showItems');
                    }
                })    
            }
            else {
                req.flash('Invalid Password');
                res.redirect('/login')
            }
        }
        else {
            res.flash('Invalid Email');
            res.redirect('/login');
        }
    }
    catch(err){
        console.log('Error in Validation',err);
    }
}

const forgetPassword=(req,res)=>{

    res.render('misc/emailPage',{
        title: 'VerifyEmail'
    });
}

const con_user=async(req,res)=>{
    try{
     // console.log(req.body);
     const user_data=await authModel.findOne({email:req.body.email});
     // console.log(user_data);
     if(user_data){
         let mailOptions={
             from:'taufikur1999@gmail.com',
             to:req.body.email,
             subject:'Email Verification',
             text:'Hello' + user_data.fullname+'\n\n'+
             '\n\nPlease click the link below to change your password'+
             '\n\n http://'+req.headers.host+'/newpassword/'+req.body.email+'\n\nThank You'
         }
     
         transport.sendMail(mailOptions,function(err,info){
             if(err){
                 console.log('Error to send mail',err);
                 res.redirect('/forgetpassword/emailVerify');
             }
             else{
                 console.log('Email sent',info.response);
                 // res.redirect('/login');
             }
         })
     }
     else{
         console.log('Email does not exists');
     }
    }
    catch(err){
         console.log('Error in validation email',err);
    }
}

const viewPassword=(req,res)=>{
    console.log('Email : ',req.params.email);
    res.render('auth/newpassword',{
        title: 'Change Password',
        data: req.params.email
    })
}

const changePassword=async(req,res)=>{
    try{
        // console.log(req.body.email);
        const user_data=await authModel.findOne({email:req.body.email});
        if(req.body.pass===req.body.con_pass){
            const hashpass=await bcrypt.hash(req.body.pass,12);
            // console.log(hashpass);
                user_data.password=hashpass;
                let save_pass=await user_data.save();
                if(save_pass){
                    console.log('Password Succesfully Changed');
                    res.redirect('/login')
                }
            }
        }
    catch(err){
        console.log('Error in changing password');
    }
}

const logout=async(req,res)=>{
    await req.session.destroy();
    res.redirect('/login')
}


module.exports={
    viewRegister,
    postRegister,
    con_mail,
    viewLogin,
    postLogin,
    forgetPassword,
    con_user,
    viewPassword,
    changePassword,
    logout
}