const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Todo = mongoose.model(
    "todo",
    new mongoose.Schema({
        text: { type: String, require: true },
        done: { type: Boolean, default: false },
    }),
);

router.get("/", async (req, res) => {
    const todos = await Todo.find();
    res.json(todos);
});

router.post("/", async (req, res) => {
    const todo = await Todo.create({ text: req.body.text });
    res.status(201).json(todo);
});

router.put("/:id", async (req, res) => {
    const todo = await Todo.findByIdAndUpdate(
        req.params.id,
        { done: req.body.done },
        { new: true },
    );
    res.json(todo);
});

router.delete("/:id", async (req, res) => {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({message:"deleted"})
});


module.exports = router;