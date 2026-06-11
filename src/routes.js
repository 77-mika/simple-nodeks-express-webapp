const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Todo = mongoose.model(
    "todo",
    new mongoose.Schema({
        text: { type: String, required: true },
        done: { type: Boolean, default: false },
        userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    }),
);

router.get("/", async (req, res) => {
    const todos = await Todo.find({ userId: req.userId });
    res.json(todos);
});

router.post("/", async (req, res) => {
    if (!req.body.text) {
        res.status(400).json({ error: "text is required" });
    }
    const todo = await Todo.create({ text: req.body.text,userId:req.userId });
    res.status(201).json(todo);
});

router.put("/:id", async (req, res) => {
    if (req.body.done === undefined) {
        res.status(400).json({ error: "'done' field is required" });
    }
    const todo = await Todo.findByIdAndUpdate(
        { _id: req.params.id, userId: req.userId },
        { done: req.body.done },
        { new: true },
    );
    if (!todo) {
        res.status(400).json({ error: "Todo not found" });
    }
    res.json(todo);
});

router.delete("/:id", async (req, res) => {
    const todo = await Todo.findByIdAndDelete({ _id: req.params.id, userId:req.userId });
    if(!todo){
        return res.status(404).json({error:"Todo not found"});
    }
    res.json({ message: "deleted" });
});

module.exports = router;
