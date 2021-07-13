const express = require('express');
const {isLoggedIn, isNotLoggedIn, verifyToken} = require('./middlewares');
const {check } = require('express-validator');
const {Login, Join, Logout} = require('../controllers/auth');

const axios = require('axios');

const router = express.Router();

router.use((req,res,next)=>{
    res.locals.user=req.user;
    //locals로 설정한 이유는 이 변수들이 모든 템플릿 엔진에서 공통으로 사용하기 때문
    next();
});



router.post('/join',isNotLoggedIn,[
    check("password", "Password is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail()
],Join );

/**
 * @swagger
 *  /auth/login:
 *    post:
 *      tags:
 *      - 로그인
 *      description: 로그인
 *      produces:
 *      - swagger
 *      parameters:
 *        - in: body
 *          name: body
 *          
 *          
 *      responses:
 *       200:
 *        description: 로그인 성공
 *       400:
 *        description: 잘못된 요청
 *       500:
 *        description: 서버 에러
 */


//로그인 할 때 마다 토큰 발급
//토큰 만료되면 클라측에서 새토큰 발급요청을 보내야함
router.post('/login',isNotLoggedIn, [
        check("password", "Password is required").not().isEmpty(),
        check("email", "Please include a valid email").isEmail()
    ], Login);


/**
 * @swagger
 *  /auth/join:
 *    post:
 *      tags:
 *      - 회원가입
 *      description: 로그인
 *      produces:
 *      - swagger
 *      parameters:
 *        - in: body
 *          name: body
 *          
 *      responses:
 *       200:
 *        description: 회원가입 성공
 *       400:
 *        description: 잘못된 요청
 *       500:
 *        description: 서버 에러
 */

//로그아웃 라우터
router.get('/logout', isLoggedIn, Logout);




/**
 * @swagger
 *  /auth/logout:
 *    get:
 *      tags:
 *      - 로그아웃
 *      description: 로그아웃
 *      
 *      
 *          
 *      responses:
 *       200:
 *        description: 로그아웃 성공
 *       400:
 *        description: 잘못된 요청
 *       500:
 *        description: 서버 에러
 */



module.exports = router;