const joi = require("joi");

const registerSchema = joi.object({
    username: joi.string().min(3).max(30).required(),
    password: joi.string().min(4).required(),
});

const LoginSchema = joi.object({
    username: joi.string().required(),
    password: joi.string().required(),
});

const TodoSchema = joi.object({
    text: joi.string().min(1).max(200).required(),
});

const TodoUpdateSchema = joi.object({
    done: joi.boolean().required(),
});

module.exports = { registerSchema, LoginSchema, TodoSchema, TodoUpdateSchema };
