const adminModel = require("../model/adminModel");
const fs=require('fs');
const path=require('path');

const viewAddItemForm=(req,res)=>{
    res.render('admin/addItem',{
        title: 'Item Registration'
    })
}

const postAddItemForm=async(req,res)=>{
    try{
        // console.log('Details',req.body);
        // console.log('Files',req.files);
        let formData=await adminModel({
            item_Name:req.body.name,
            item_Category:req.body.category,
            item_Price:req.body.price,
            item_Image1:req.files.item_image_1[0].filename,
            item_Image2:req.files.item_image_2[0].filename,
            item_Description:req.body.desc
        })
        await formData.save();
        res.redirect('/showItems');

    }
    catch(err){
        console.log('Error in saving Database',err);
        req.flash('error','ERROR')
    }
}

const showItems=async(req,res)=>{
    let details=await adminModel.find();
    // console.log(details);
    if(details){
        res.render('admin/showItems',{
            title: 'All Items',
            data: details
        })
    }
}

const deleteData=async(req,res)=>{
    try{
        let id=req.params.id;
        console.log('id',id);
    
        let deleted=await adminModel.findOneAndDelete({'_id':id});
        console.log('Deleted',deleted);
        if(deleted){
                    
            fs.unlinkSync(path.join(__dirname,"..","uploads",deleted.item_Image1));
            fs.unlinkSync(path.join(__dirname,"..","uploads",deleted.item_Image2));
    
            }
            res.redirect('/showItems');
    }
    catch(err){
        console.log('Error in deletion',err);
    }
}

const viewEdit=async(req,res)=>{
    try{
        let id=req.params.id;
        console.log('id',id);
    
        let old=await adminModel.findById({'_id':id});
        console.log('Old',old);
        if(old){
            res.render('admin/edititem',{
                title: 'Edit Page',
                data:old
            })
        }
    }
    catch(err){
        console.log('Error in viewing edit page',err);
    }
}

const postEdit=async(req,res)=>{
    try{

        let id=req.body.id;
        console.log('id',id);
        // let old=await authModel.findById({'_id':id});
        // console.log('EditPage Old',old);
        // console.log('req files',req.files);
        // let arr;

        // if(req.files){
        //     arr=req.files.map(item=>{return item.filename});
        //     console.log(arr);
        //     old.emp_image.forEach(item=>{
        //         fs.unlinkSync(path.join(__dirname,"..","uploads",item));
        //     })
        // }
        // else
        // arr=old.emp_image;
        // // console.log(arr);
        // // console.log(old.date);
        // const updated=await authModel.updateOne({_id:id},{
        //     fullname:req.body.name,
        //     email:req.body.email,
        //     phone_no:req.body.number,
        //     address:req.body.address,
        //     city:req.body.city,
        //     pincode:req.body.pin,
        //     emp_image:(req.files.length<1)?old.emp_image:arr
        // })
        // console.log(updated);
        // res.redirect('/profile')
    }
    catch(err){
        console.log('Error in editing Page',err);
    }
}

const showDetails=async(req,res)=>{
    try{
        let id=req.params.id;
        // console.log('id',id);
        const details=await adminModel.findOne({_id:id});
        // console.log('Details',details);
        if(details){
            res.render('admin/showDetails',{
                title: 'Show Details',
                data: details
            })
        }
    }
    catch(err){
        console.log('Error in showing Details',err);
    }
}


module.exports={
    viewAddItemForm,
    postAddItemForm,
    showItems,
    deleteData,
    viewEdit,
    postEdit,
    showDetails   
}