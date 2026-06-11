const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { registerSchema, loginSchema } = require("./validators");
const validate = require("./validate");

const User = mongoose.model(
    "User",
    new mongoose.Schema({
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true },
    }),
);

router.post("/register", validate(registerSchema), async (req, res) => {
    try {
        const { username, password } = req.body;

        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({
            username: username,
            password: hashed,
        });
        res.status(201).json({ message: "User Created", userId: user._id });
    } catch (err) {
        if (err.code === 11000) {
            return res
                .status(409)
                .json({ error: "Username already taken      " });
        }
        next(err);
    }
});

router.post("/login", validate(loginSchema), async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        res.json({ token });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
