const express=require('express');
const { viewAddItemForm, postAddItemForm, showItems, deleteData, viewEdit, postEdit, showDetails } = require('../controller/adminController');
const adminRouter=express.Router();
const path=require('path');
const multer=require('multer');

const fileStorage=multer.diskStorage({
    destination:(req,file,callback)=>{
        callback(null,path.join(__dirname,'..','uploads'),(err,data)=>{
            if(err)
                throw err;
        })
    },
    filename:(req,file,callback)=>{
        callback(null,file.originalname,(err,data)=>{
            if(err)
                throw err;
        })
    }
})

const fileFilter=(req,file,callback)=>{
    if(
        file.mimetype.includes('jpeg')||
        file.mimetype.includes('jpg')||
        file.mimetype.includes('png')||
        file.mimetype.includes('webp')
    )
    callback(null,true)
    else
    callback(null,false)
}

const upload=multer({
    storage:fileStorage,
    fileFilter:fileFilter,
    limits:{fieldSize:1025*1025*5}
})

const upload_type=upload.fields([{name:'item_image_1',maxCount:1},{name:'item_image_2',maxCount:1}])

adminRouter.get('/',viewAddItemForm);
adminRouter.post('/postItem',upload_type,postAddItemForm);

adminRouter.get('/showItems',showItems);

adminRouter.get('/delete/:id',deleteData);

adminRouter.get('/edit/:id',viewEdit);
adminRouter.post('/postEdit',postEdit);

adminRouter.get('/details/:id',showDetails)

module.exports=adminRouter