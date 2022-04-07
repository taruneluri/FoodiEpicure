const mongoose=require('mongoose');
var Schema=mongoose.Schema;
const user=new Schema({
    uname:{
        type:String,
        required:true
    },
    ucity:{
        type:String,
        required:true
    },
    uno:{
        type:Number,
        required:true
    },
    umail:{
        type:String,
        required:true
    },
    upswd:{
        type:String,
        required:true
    }
});
module.exports=mongoose.model('User',user);