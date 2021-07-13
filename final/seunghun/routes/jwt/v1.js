const express = require('express');
const jwt = require('jsonwebtoken');

const {verifyToken} = require('../middlewares');
const User = require('/Users/seungh/Desktop/appCenter/final/seunghun/models/user.js');

const router = express.Router();

router.post('/',async(req,res) =>{
    try{
        const result = await User.findOne({
            where:{id:req.body.id}
        })

        const token = jwt.sign({
            id: result.id,
            nick: result.nickName,
        },process.env.JWT_SECRET,{
            expiresIn: '10h',//유효기간 10분으로 함
        });
        res.json({
            code:200,
            message:'토큰이 발급되었습니다',
            token,
        });
    }catch(error){
        console.error(error);
        return res.status(500).json({
            code: 500,
            message: '서버 에러',
        });
    }

    
});

module.exports = router;