const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

router.post("/create", async(req,res)=>{
try{

const task = new Task(req.body);
await task.save();

res.json(task);

}catch(err){
res.status(500).json(err);
}
});

router.get("/:projectId", async(req,res)=>{

const tasks = await Task.find({project:req.params.projectId});

res.json(tasks);

});

router.put("/:taskId", async(req,res)=>{

const updated = await Task.findByIdAndUpdate(
req.params.taskId,
req.body,
{new:true}
);

res.json(updated);

});

module.exports = router;