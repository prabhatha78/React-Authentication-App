const jwt = require('jsonwebtoken');
const maxAge = 3 * 24 * 60 * 60;
const bcrypt = require('bcrypt');
const AdminSchema = require('../models/adminModel');
const userModel = require('../models/userModel');
const { response } = require('express');


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
            errors['message'] = properties.message
        })
        return errors
    }
}

const adminDoLogin = async (req, res) => {
    try {
        const { name, password } = req.body;
        const admin = await AdminSchema.findOne({ username: name });
        if (admin) {
            const validPassword = await bcrypt.compare(password, admin.password);
            if (validPassword) {
                const token = createTocken(admin._id);
                res.cookie("jwt", token, {
                    withCredential: true,
                    httpOnly: false,
                    maxAge: maxAge * 1000
                })
                res.status(200).json({ admin,token, created: true });
            } else {
                const errors = { name: "Incorrect username or password" }
                res.json({ errors, created: false })
            }

        } else {
            const errors = { name: "User Name not exists" }
            res.json({ errors, created: false })
        }
    } catch (err) {
        console.log(err);
        const errors = { name: "Some thing went wrong" }
        res.json({ errors, created: false })
    }
}


const getUserList = (req, res) => {
    try {
        userModel.find().then((userList) => {
            res.json({ message: "Success", status: true, userList })
        })
    } catch (err) {
        res.json({ message: "Some thing went wrong", status: false });
    }
}


const deleteUser = (req, res) => {
    try {
        userModel.deleteOne({ _id: req.params.userId }).then((response) => {
            res.json({ message: "Success", status: true })
        })
    } catch (e) {
        res.json({ message: "Some thing went wrong", status: false })
    }
}

const editUser = (req, res) => {
    console.log("entere");
    try {
        console.log(req.body);
        userModel.updateOne({ _id: req.body.id },
            {
                $set: {
                    name: req.body.name,
                    email: req.body.email,
                    phone: req.body.phone

                }
            }).then((response) => {
                res.json({ message: "Updated", status: true });

            })
    } catch (e) {
        res.json({ message: "Some thing went wrong", status: false });
    }
}

const addUser = async (req, res) => {
    try {
        console.log(req.body.password);
        userModel.create({
            name:req.body.name,
            email:req.body.email,
            phone:req.body.phone,
            password:req.body.password
        })
            .then((response) => {
                res.json({ message: "User Created Successfully", status: true, created: true });
            }).catch((error) => {
                const errors = handleError(error);
                res.json({ errors, status: false, created: false })


            })

    } catch (e) {
        res.json({errors:{message: "Some thing went wrong"}, status: false })
    }
}





module.exports = {
    adminDoLogin,
    getUserList,
    deleteUser,
    editUser,
    addUser
}