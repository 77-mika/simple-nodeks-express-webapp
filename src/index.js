require("dotenv").config();
const express = require("express");
const connectDB = require("./db");
const todoRouter = require("./routes");
const authRoute = require("./auth");
const authMiddleware = require("./middleware");

const app = express();
app.use(express.json());

app.use("/auth", authRoute);
app.use("/todos", authMiddleware, todoRouter);

app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: "Something went wrong",
        message: err.message,
    });
});

const start = async () => {
    await connectDB();
    app.listen(process.env.PORT, () => {
        console.log(`Server is running in localhost:${process.env.PORT}`);
    });
};

start();
