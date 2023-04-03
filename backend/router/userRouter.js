const express = require('express');
const { doSignup, doLogin } = require('../controller/authController');
const { updateProfile } = require('../controller/userController');
const { verifyLogin } = require('../middleware/AuthUser');
const { uploadImage } = require('../middleware/image-upload');
const router=express.Router()

router.post('/',verifyLogin)
router.post('/signup',doSignup);
router.post('/login',doLogin);
router.post('/upload-image',uploadImage,updateProfile);








module.exports=router;