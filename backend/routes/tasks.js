const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const Project = require("../models/Project");
const auth = require("../middleware/auth");

const ALLOWED_STATUS = ["todo", "inprogress", "done"];

router.get("/", auth, async (req, res) => {
  try {
    const projectId = String(req.query.projectId || "").trim();

    if (!projectId) {
      return res.status(400).json({ message: "projectId is required" });
    }

    const project = await Project.findOne({ _id: projectId, owner: req.user.id });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const tasks = await Task.find({ project: projectId, owner: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const title = String(req.body.title || "").trim();
    const description = String(req.body.description || "").trim();
    const status = String(req.body.status || "todo").trim().toLowerCase();
    const projectId = String(req.body.project || "").trim();

    if (!title || !projectId) {
      return res.status(400).json({ message: "Title and project are required" });
    }

    if (!ALLOWED_STATUS.includes(status)) {
      return res.status(400).json({ message: "Invalid task status" });
    }

    const project = await Project.findOne({ _id: projectId, owner: req.user.id });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const task = await Task.create({
      title,
      description,
      status,
      project: projectId,
      owner: req.user.id,
      assignedTo: req.user.id
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.patch("/:taskId/status", auth, async (req, res) => {
  try {
    const status = String(req.body.status || "").trim().toLowerCase();
    if (!ALLOWED_STATUS.includes(status)) {
      return res.status(400).json({ message: "Invalid task status" });
    }

    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.taskId, owner: req.user.id },
      { status },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:taskId", auth, async (req, res) => {
  try {
    const deleted = await Task.findOneAndDelete({ _id: req.params.taskId, owner: req.user.id });
    if (!deleted) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
