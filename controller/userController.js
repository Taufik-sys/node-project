const adminModel = require("../model/adminModel");
let arr=[];

const showDetails=async(req,res)=>{
    try{
        let id=req.params.id;
        // arr=[];
        // console.log('id',id);
        const details=await adminModel.findOne({_id:id});
        arr.push(details);
        // console.log('Details in array',arr);
        // console.log('Details',details);
        let filtered=arr.filter(x=>{return x.isDeleted===false});
        console.log('Filtered Details',filtered);
        if(details){
            res.render('frontend/showDetails',{
                title: 'Show Details',
                data: filtered
            })
        }
    }
    catch(err){
        console.log('Error in showing Details',err);
    }
}

const removeData=async(req,res)=>{
    try{
        let id=req.params.id;
        console.log('id',id);
        const details=await adminModel.findOne({_id:id});
        // console.log('Details',details);
        if(!details.isDeleted){
            details.isDeleted=true;
            res.redirect('/showItems');
            console.log('Details',details);
        }
        await details.save();
    }
    catch(err){
        console.log('Error in soft removing of data',err);
    }
}


module.exports={
    showDetails,
    removeData
}