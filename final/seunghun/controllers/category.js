const {Post, Image, Comment ,Category} = require('../models');
const { sequelize } = require('../models');
const {check,validationResult } = require('express-validator');

exports.postList = async(req,res,next) => {
    var i = validate(req);
    if(i){
        return res.json(i);
    };
    var pagenum = req.body.pagenum;//페이지 번호를 받아와서 페이징 처리
    var postlist = 15*(pagenum -1);//페이지는  시작, offset은 0부터 시작이니 1을 빼줌
    console.log(pagenum);
    console.log(postlist);
    try{
        const [post,metadata] = await sequelize.query(`select * from posts where category = ${req.body.categoryId} limit 15 offset ${postlist}`)
        
        res.json(post);
    }catch(error){
        console.error(error);
        next(error);
    }
};

exports.categoryList = async(req,res,next) =>{
    try{
        const list = await Category.findAll({});//카테고리 리스트
        res.json(list);
    }catch(error){
        console.error(error);
        next(error);
    }
};

//요청검증 함수
function validate(req){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return errors.array();
    }
};