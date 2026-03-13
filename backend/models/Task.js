const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({

  title:{
    type:String,
    required:true
  },

  description:{
    type:String
  },

  status:{
    type:String,
    enum:["todo","inprogress","done"],
    default:"todo"
  },

  project:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Project"
  },

  owner:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },

  assignedTo:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  }

},{timestamps:true});

module.exports = mongoose.model("Task",taskSchema);