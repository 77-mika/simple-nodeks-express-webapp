require("dotenv").config();
const express = require("express");
const connectDB = require("./db");
const todoRouter = require("./routes");

const app = express();
app.use(express.json());

app.use('/todos',todoRouter);

const start = async () => {
    await connectDB();
    app.listen(process.env.PORT,()=>{
        console.log(`Server is running in localhost:${process.env.PORT}`)
    });
};

start();
