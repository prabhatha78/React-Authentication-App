const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"User name is required"],
        unique:true
    },
    email:{
        type:String,
        required: [true, "Email name is required"],

    },
    phone:{
        type:Number,
        required: [true, "Phone name is required"],

    },
    password:{
        type:String,
        required:[true,"Password is required"]
    },
    image:{
        type:Object,
    }
})

userSchema.pre("save",async function(next){
    this.password = await bcrypt.hash(this.password, 10);
   
})

module.exports=mongoose.model("Users",userSchema);