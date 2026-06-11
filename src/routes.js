const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const validate = require("./validate");
const { TodoSchema, TodoUpdateSchema } = require("./validators");

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

router.post("/", validate(TodoSchema), async (req, res) => {
    try {
        const todo = await Todo.create({
            text: req.body.text,
            userId: req.userId,
        });
        res.status(201).json(todo);
    } catch (err) {
        next(err);
    }
});

router.put("/:id", validate(TodoUpdateSchema), async (req, res) => {
    try {
        const todo = await Todo.findByIdAndUpdate(
            { _id: req.params.id, userId: req.userId },
            { done: req.body.done },
            { new: true },
        );
        if (!todo) {
            res.status(404).json({ error: "Todo not found" });
        }
        res.json(todo);
    } catch (err) {
        next(err);
    }
});

router.delete("/:id", async (req, res, next) => {
    try {
        const todo = await Todo.findByIdAndDelete({
            _id: req.params.id,
            userId: req.userId,
        });
        if (!todo) {
            return res.status(404).json({ error: "Todo not found" });
        }
        res.json({ message: "deleted" });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
