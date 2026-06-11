const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = mongoose.model(
    "User",
    new mongoose.Schema({
        username: { type: String, required: true, unique: true },
        password: { type: String, required:true },
    }),
);

router.post("/register", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res
            .status(400)
            .json({ error: "Username and password are required" });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username: username, password: hashed });
    res.status(201).json({ message: "User Created", userId: user._id });
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
        return res
            .status(401)
            .json({ message: "Invalid credentials" });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        return res
            .status(401)
            .json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
    res.json({ token });
});

module.exports = router;
