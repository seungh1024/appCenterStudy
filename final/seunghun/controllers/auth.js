const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const {check, validationResult } = require('express-validator');

const axios = require('axios');

exports.Join = async(req,res,next) => {
    var i = validate(req);
    if(i){
        return res.status(400).json(i);
    };
    const {email,password,nickName,Role} = req.body;
    {
        try{
            const exUser = await User.findOne({
                where:{email}
            });
            if(exUser){
                return res.status(200).send(`이미 가입한 이메일 입니다`);
            }
            const hash = await bcrypt.hash(password, 12);
            await User.create({
                email,
                password:hash,
                nickName,
                Role,
            })
            res.send('가입 완료');
        }catch(error){
            console.error(error);
            return next(error);
        }
    }
};

exports.Login = async(req,res,next)=>{
    var i = validate(req);
    if(i){
        return res.status(400).json(i);
    }
    
    //passsport.authenticate('local') 미들웨어가 로컬 로그인 전략 수행함
    //미들웨어인데 라우터 미들웨어 안에 들어있는 형태 -> (req,res,next) 붙인 것
    passport.authenticate('local', (authError, user, info) => {//콜백함수
        if(authError){//전략 실패시 authError값이 존재함
            console.error(authError);
            return next(authError);
        }
        if(!user){//user가 없으면 사용자가 없는 것
            return res.send(info.message);
        }
        //user가 존재하면 로그인 메서드 호출함
        //passport 가 req객체에 login, logout 메서드를 추가하고
        //req.login 이 passport.serializeUser를 호출함
        return req.login(user, async(loginError) => {
            if(loginError) {
                console.error(loginError);
                return next(loginError);
            }
            
            if(!req.decoded){
                try{
                    const result =await axios.post(`http://localhost:8001/token`,user);
                    res.json(result.data);
                }catch(error){
                    console.error(error);
                    next(error);
                }
            }
            else{
                return res.send('로그인 성공');
            }
            
        });
    })(req,res,next); //미들웨어 내의 미들웨어는 (req,res,next) 붙여야함
};

exports.Logout = (req,res) => {
    req.logout();
    req.session.destroy();
    delete req.headers.authorization;//로그아웃 시 헤더 토큰 삭제
    res.send('로그아웃 성공');
};

//요청검증 함수
function validate(req){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return errors.array();
    }
};