const bcrypt = require('bcrypt');

const {User , Post, Comment, Image} = require('../models');
const {check, validationResult} = require('express-validator');
const destroyImage = require('../utils/s3delete');
const {sequelize} = require('../models');

exports.Update = async(req,res,next) => {
    var i = validate(req);
    if(i){
        return res.json(i);
    };
    console.log(req.user);
    const hash = await bcrypt.hash(req.body.password, 12);
    try{
        const result = await User.update({
            password: hash,
            nickName: req.body.nickNmae,
        },{
            where:{ id : 9 },
        });
        if(result){
            res.status(200).send('수정 완료');
        }
    }catch(error){
        console.error(error);
        next(error);
    }
};

exports.Delete = async(req,res,next) => {
    try{
        const post = await Post.findAll({
            where:{Member:req.params.userId}
        });

        imagedelete(req.params.userId);
        await User.destroy({
            where:{id: req.params.userId}
        });
        await Post.destroy({
            where:{Member:req.params.userId}
        })
        await Comment.destroy({
            where:{ Member: req.params.userId }
        });
        res.status(200).send('탈퇴 완료');

    }catch(error){
        console.error(error);
        next(error);
    }
};

exports.Info = async(req,res,next) => {
    try{
        const result = await User.findOne({
            where:{ id: req.user.id },
        });
        res.status(200).json(result);
    }catch(error){
        console.error(error);
        next(error);
    }
    
};

exports.getPost = async(req,res,next) => {
    try{
        const user = await Post.findAll({
            where:{Member: req.user.id}
        })
        res.status(200).json(user);
    }catch(error){
        console.error(error);
        next(error);
    }
};

exports.writeComment = async(req,res,next) =>{

    var i = validate(req);
    if(i){
        return res.json(i);
    };
    try{
        const result = await Comment.create({
            content:req.body.content,
            Member:req.user.id,
            post:req.body.postId,
        })
        res.status(200).json(result);
    }catch(error){
        console.error(error);
        next(error);
    }
};

exports.updateComment = async(req,res,next) =>{
    var i = validate(req);
    if(i){
        return res.json(i);
    };
    try{
        await Comment.update({
            content:req.body.content,
        },{
            where:{id:req.params.commentId}
        })
        res.status(200).send('수정 완료');
    }catch(error){
        console.error(error);
        next(error);
    }
};

exports.deleteComment = async(req,res,next) =>{
    try{
        Comment.destroy({
            where:{id:req.params.commentId}
        })
        res.status(200).send('삭제 완료');
    }catch(error){
        console.error(error);
        next(error);
    }
};

//s3이미지 삭제함수
async function imagedelete(user){

    const [image,metadata] = await sequelize.query(`select images.* from images,posts where images.post = posts. id and posts.member = ${user};`)
    //삭제할 객체 담을 params
    var params = {
        Bucket: "appcenterfinal",
        Delete:{
            Objects:[
    
            ],
            Quiet : false,
        }
    };
    if(image){
        for(var i =0; i<image.length; i++){
            var key = image[i].thumbnailImageUrl.split('com/');
            console.log(key[1]);
            var a = {Key: key[1]}
            params.Delete.Objects.push(a);
            console.log(a);
        };
        console.log(params);
        await destroyImage(params);//삭제 요청을 보내는 메서드
        
    };
    
}

//요청검증 함수
function validate(req){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return errors.array();
    }
};
