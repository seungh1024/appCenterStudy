const express = require('express');

const {isLoggedIn, isNotLoggedIn ,verifyToken} = require('./middlewares');
const {check } = require('express-validator');
const { postList, categoryList } = require('../controllers/category');

const router = express.Router();

//카테고리의 게시글 리스트 조회(페이징)
router.post('/postlist',isLoggedIn, verifyToken, [
    check("categoryId", "categoryId is required").not().isEmpty(),
    check("pagenum", "pagenum is required").not().isEmpty()
],postList)

//카테고리 리스트 조회
router.get('/categorylist',isLoggedIn, verifyToken, categoryList);

/**
 * @swagger
 *  /category/postlist:
 *    post:
 *      tags:
 *      - 카테고리 게시글 리스트 조회(페이징)
 *      description: 카테고리 게시글 리스트 조회(페이징)
 *      produces:
 *      - swagger
 *      parameters:
 *        - in: body
 *          name: body
 *          
 *          
 *      responses:
 *       200:
 *        description: 페이징 요청 성공
 *       400:
 *        description: 잘못된 요청
 *       500:
 *        description: 서버 에러
 */

 /**
 * @swagger
 *  /category/categorylist:
 *    get:
 *      tags:
 *      - 카테고리 게시글 리스트 조회(페이징)
 *      description: 카테고리 게시글 리스트 조회(페이징)
 *      produces:
 *      - swagger
 *      responses:
 *       200:
 *        description: 카테고리 조회 성공
 *       400:
 *        description: 잘못된 요청
 *       500:
 *        description: 서버 에러
 */




module.exports = router;