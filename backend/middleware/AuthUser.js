const userModel=require('../models/userModel');
const jwt=require('jsonwebtoken');

const verifyLogin=(req,res,next)=>{
    const token=req.cookies.jwt;
    if(token){
        jwt.verify(token, 'meralkey', async (err, decoded)=>{
            // console.log(decoded.iat);

            if(err){
                res.json({status:false});
                
                next();
            }else{
                const user=userModel.findById({_id:decoded.id});
                if(user){
                    res.json({status:true,user:user.name});
                    next()
                }else{
                    res.json({status:false})
                    next()
                }
            }
        });
    }else{
        res.json({ status: false })
        next()
    }
}

module.exports={verifyLogin}