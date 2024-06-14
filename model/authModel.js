const mongoose=require('mongoose');
const authSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    
},{
    timestamps:true,
    versionKey:false
})

const authModel=new mongoose.model('auth_details',authSchema);

module.exports=authModel;