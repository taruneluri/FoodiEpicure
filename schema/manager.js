const mongoose=require('mongoose');
var Schema=mongoose.Schema;
const man=new Schema({
    rfname:{
        type:String,
        required:true
    },
    roname:{
        type:String,
        required:true
    },
    rname:{
        type:String,
        required:true
    },
    rcity:{
        type:String,
        required:true
    },
    rno:{
        type:Number,
        required:true
    },
    rmail:{
        type:String,
        required:true
    },
    rpswd:{
        type:String,
        required:true
    }
});
module.exports=mongoose.model('Man',man);