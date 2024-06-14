const mongoose=require('mongoose');
const tokenSchema=new mongoose.Schema({
    _userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'auth_details'
    },
    token:{
        type:String,
        required:true
    }
},{
    versionKey:false
});

const tokenModel=new mongoose.model('token_details',tokenSchema);

module.exports=tokenModel;