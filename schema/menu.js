const mongoose=require('mongoose');
var Schema=mongoose.Schema;
const menu=new Schema({
    rmail:{
        type:String,
        required:true
    },
    mname:{
        type:String,
        required:true
    },
    mcat:{
        type:String

    },
    mdesc:{
        type:String,
    },
    mprice:{
        type:Number,
        required:true
    }
});
module.exports=mongoose.model('Menu',menu);