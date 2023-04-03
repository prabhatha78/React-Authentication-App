const userModel = require('../models/userModel');



const updateProfile = async (req, res) => {
    try {
        req.files.image[0].path = req.files.image[0].path.replace('public\\', "");

        let user = await userModel.findOne({ _id: req.headers.userid })

        if (user) {
            await userModel.updateOne({ _id: req.headers.userid }, {
                $set: {
                    image: req.files.image[0]
                }
            }).then(async () => {
                let user = await userModel.findOne({ _id: req.headers.userid })

                res.json({ message: "Image uploaded successfully", user, status: true });
            }).catch((err) => {
                console.log(err);
                res.json({ message: "Something went wrong", status: false });
            })
        } else {
            res.json({ message: "User Not Exists", status: false });
        }

    } catch (e) {
        console.log(e);
        res.json({ message: "Something went wrong", status: false });
    }
}

module.exports = {
    updateProfile
};