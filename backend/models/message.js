const mongoose = require("mongoose");

const messageschema = new mongoose.Schema(
  {
    sender:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"user",
      required:true,
    },
    receiver:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"user",
      required:true,
    },
    content:{
      type:String,
      required: true,
      trim:true,
    },
    isRead:{
      type:Boolean,
      default:false,
    },
    isEdited :{
      type:Boolean,
      default:false,
    }
},
{timestamps:true}
);

module.exports = mongoose.model("message",messageschema);