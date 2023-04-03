const express = require('express');
const { adminDoLogin, getUserList, deleteUser, editUser, addUser } = require('../controller/adminController');
const { verifyLogin } = require('../middleware/AuthAdmin');
const router = express.Router();


router.post('/', adminDoLogin);
router.get('/user-list', verifyLogin, getUserList);
router.delete('/delete-user/:userId',verifyLogin, deleteUser);
router.put('/edit-user/',verifyLogin, editUser);
router.post("/add-user",verifyLogin, addUser)


module.exports = router;