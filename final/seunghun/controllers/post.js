const express = require('express');
const fs = require('fs');
const upload = require('../utils/s3');
const destroyImage = require('../utils/s3delete');

const {Post, Image, Comment } = require('../models');
const {check, validationResult} = require('express-validator');

exports.makePost = async(req,res,next) => {
    var i = validate(req);
    if(i){
        return res.json(i);
    };
    
    try{
        const result = await Post.create({
            title:req.body.title,
            content:req.body.content,
            Member:req.user.id,
            category:req.body.categoryId,
        })
        console.log(result);
        console.log(req.files);
        
        uploadImage(req,result.id);
        res.json('게시글 생성 완료');
    }catch(error){
        console.error(error);
        next(error);
    }
    
};

exports.updatePost =async(req,res,next) =>{
    try{
        const image = await Image.findAll({
            attributes:[
                "thumbnailImageUrl"
            ],
            where:{
                post:req.body.postId
            }
        });
        
        imagedelete(image,0);
        
        if(req.files){
            var origin = req.body.imageUrl;
            for(var i = 0; i<req.files.length; i++){
                try{
                    await Image.update({
                        storeName : req.files[i].originalname,
                        imageUrl:origin,
                        thumbnailImageUrl: req.files[i].location,
                        
                    },{
                        where:{post:req.body.postId}
                    })
                }catch(error){
                    console.error(error);
                }
                
            }
        }
    
        await Post.update({
            title:req.body.title,
            content:req.body.content,
        },{
            where:{id:req.body.postId}
        })

        res.status(200).json('수정 완료');
    }catch(error){
        console.error(error);
        next(error);
    }
    
};

exports.deletePost = async(req,res,next) => {
    try{
        const image = await Image.findAll({
            where:{post: req.params.postId}
        });
        
        imagedelete(image,0);
        await Post.destroy({
            where:{id:req.params.postId}
        });
        res.status(200).json('삭제 완료');
    }catch(error){
        console.error(error);
        next(error);
    }
};

exports.postInfo = async(req,res,next) =>{
    try{
        const result = await Post.findAll({
            include:[
                {
                    model:Comment,
                },
                {
                    model:Image,
                }
            ],
            where:{id:req.params.postId}
        })
        
        // var url = image[0].thumbnailImageUrl;
        // var downpath = req.body.downpath;
        // https.get(url, resp => resp.pipe(fs.createWriteStream(downpath)));
    
        res.json(result);
    }catch(error){
        console.error(error);
        next(error);
    }
};

exports.addPost = async(req,res,next) =>{
    if(uploadImage(req,req.params.postId)){
        res.json("이미지 추가 완료");
    }else{
        res.json("이미지 추가 실패");
    }
    
};

exports.deleteImage = async(req,res,next) =>{
    var imageId = req.params.imageId;
    try{
        const image = await Image.findAll({
            wehre:{id:imageId},
        })
        imagedelete(image,imageId);

        res.status(200).send('이미지 한개 삭제 완료');
    }catch(error){
        console.error(error);
        next(error);
    }
};

//이미지 업로드 함수
async function uploadImage(req,resultId){
    var origin = req.body.imageUrl;
    if(req.files){
        for(var i = 0; i<req.files.length; i++){
        try{
            const image = await Image.create({
                storeName : req.files[i].originalname,
                imageUrl:origin,
                thumbnailImageUrl: req.files[i].location,
                post:resultId
            })
        }catch(error){
            console.error(error);
            return false;
        }
        
    }
    }
    
    return true;
};

//s3이미지 삭제함수
async function imagedelete(image,imageId){
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
        };
        console.log(params);
        await destroyImage(params);//삭제 요청을 보내는 메서드
        
    };
    if(imageId !=0){
        await Image.destroy({
            where:{id:imageId}
        })
    };
    
}


//요청검증 함수
function validate(req){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return errors.array();
    }
};