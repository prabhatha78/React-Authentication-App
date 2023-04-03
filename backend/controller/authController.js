const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const maxAge = 3 * 24 * 60 * 60;
const bcrypt = require('bcrypt');


const createTocken = (id) => {
    return jwt.sign({ id }, 'meralkey', {
        expiresIn: maxAge
    });
}


const handleError = (err) => {
    let errors = { name: "", password: "" }

    if (err.code === 11000) {
        errors.name = "Name is already exists";
        return errors;
    }

    if (err.message.includes("Users validation failed")) {
        Object.values(err.errors).forEach((properties) => {
            errors[properties.path] = properties.message
        })
        return errors
    }
}

const doSignup = async (req, res, next) => {
    try {
        let { name,email,phone, password } = req.body;
        const user = await userModel.create({ name,email,phone, password });
        res.status(201).json({ user: { id: user._id, name: user.name }, created: true });
    } catch (error) {
        const errors = handleError(error);
        res.json({ errors, created: false })
    }
}

const doLogin = async (req, res) => {
    try {
        const { name, password } = req.body;
        const user = await userModel.findOne({ name: name });
        if (user) {
            const validPassword = await bcrypt.compare(password, user.password);
            if (validPassword) {
                const token = createTocken(user._id);
                res.cookie("jwt", token, {
                    withCredential: true,
                    httpOnly: false,
                    maxAge: maxAge * 1000
                })
                res.status(200).json({ user, token, created: true });
            } else {
                const errors = { name: "Incorrect username or password" }
                res.json({ errors, created: false })
            }

        } else {
            const errors = { name: "User Name not exists" }
            res.json({ errors, created: false })
        }
    } catch (err) {
        const errors = { name: "Some thing went wrong" }
        res.json({ errors, created: false })
    }
}



module.exports = {
    doSignup,
    doLogin
};