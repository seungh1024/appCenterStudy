const {Post, Image, Comment ,Category, User} = require('../models');
const fs = require('fs');
const { Sequelize } = require('sequelize');
const {check,validationResult } = require('express-validator');
const destroyImage = require('../utils/s3delete');

exports.makeCategory = async(req,res,next) =>{
    var i = validate(req);
    if(i){
        return res.json(i);
    };
    try{
        if(req.user.Role != '관리자'){
            return res.status(400).json('권한이 없습니다');
        }
        const result = await Category.create({
            name:req.body.name,
        })
        res.json(result);
    }catch(error){
        console.error(error);
        next(error);
    }
};

exports.updateCategory = async(req,res,next) =>{
    var i = validate(req);
    if(i){
        return res.json(i);
    };
    if(req.user.Role != '관리자'){
        res.status(400).json('권한이 없습니다');
    }
    try{
        await Category.update({
            name:req.body.name
        },{
            where:{id:req.body.id}
        });
        res.status(200).send('카테고리 이름 수정 완료');
    }catch(error){
        console.error(error);
        next(error);
    }
};

exports.deleteCategory =async(req,res,next) =>{
    var i = validate(req);
    if(i){
        return res.json(i);
    };
    if(req.user.Role != '관리자'){
        res.status(400).json('권한이 없습니다');
    }
    try{
        const posts = await Post.findAll({
            where:{category: req.body.categoryId}//카테고리를 지우니 카테고리 아이디로 함
        });
        console.log(posts[0]);
        
        if(posts){
            for(var i = 0; i< posts.length; i ++){
                const image = await Image.findAll({
                    where:{post:posts[i].id}
                })
                imagedelete(image);
            }
            
        }
        
        //이미지 파일 제거 후 전체 제거. 모델 옵션에 cascade를 해줬기 때문에
        //카테고리에 걸려있는 외래키 칼럼들이 모두 제거됨
        await Category.destroy({
            where:{id:req.body.categoryId}
        })
        res.status(200).send('삭제 완료');
    }catch(error){
        console.error(error);
        next(error);
    }
};

exports.adminPost = async(req,res,next) =>{
    var i = validate(req);
    if(i){
        return res.json(i);
    };
    if(req.user.Role != '관리자'){
        res.status(400).json('권한이 없습니다');
    }
    try{
        const images = await Image.findAll({
            where:{post: req.params.postId}
        });
        if(images){
            imagedelete(images);
        }

        await Post.destroy({
            where:{id:req.params.postId}
        });
        res.status(200).send('삭제 완료');
    }catch(error){
        console.error(error);
        next(error);
    }
};

exports.adminComment =async(req,res,next) => {
    if(req.user.Role != '관리자'){
        res.status(400).json('권한이 없습니다');
    }
    try{
        await Comment.destroy({
            where:{id:req.params.commentId},
        })
        res.status(200).send('댓글 삭제 완료');
    }catch(error){
        console.error(error);
        next(error);
    }
};


//s3이미지 삭제함수
async function imagedelete(image){
    //삭제할 객체 담을 params
    var params = {
        Bucket: "appcenterfinal",
        Delete:{
            Objects:[
    
            ],
            Quiet : false,
        }
    };
    if(image.length> 0){
        for(var i =0; i<image.length; i++){
            var key = image[i].thumbnailImageUrl.split('com/');
            console.log(key[1]);
            var a = {Key: key[1]}
            params.Delete.Objects.push(a);
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