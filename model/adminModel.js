const mongoose=require('mongoose');
const adminSchema=new mongoose.Schema({
    item_Name:{
        type:String,
        required:true
    },
    item_Category:{
        type:String,
        required:true
    },
    item_Price:{
        type:Number,
        required:true
    },
    item_Image1:{
        type:String,
        required:false
    },
    item_Image2:{
        type:String,
        required:false
    },
    item_Description:{
        type:String,
        required:true
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true,
    versionKey:false
})

const adminModel=new mongoose.model('items',adminSchema);

module.exports=adminModel;