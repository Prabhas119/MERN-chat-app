const mongoose = require("mongoose");

const userschema = new mongoose.Schema(
  {
    username:{
      type: String,
      required: true,
      unique:true,
      trim:true,
      minlength:3,
    },
    email:{
      type:String,
      required:true,
      unique:true,
      lowercase:true,
    },
    password:{
      type:String,
      required:true,
      minlength:6,
    },
    avatar:{
      type:String,
      default:"",
    },
    isOnline:{
      type:Boolean,
      default:false,
    },
},
{timestamps: true}
);
module.exports = mongoose.model("user",userschema);