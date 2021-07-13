const express = require('express');

const {isLoggedIn, isNotLoggedIn , verifyToken} = require('./middlewares');
const {Post, Image, Comment ,Category, User} = require('../models');
const fs = require('fs');
const { Sequelize } = require('sequelize');
const {check } = require('express-validator');
const { updateCategory, makeCategory, deleteCategory ,adminPost, adminComment} = require('../controllers/admin');


const router = express.Router();

//카테고리 생성,수정,삭제
router.route('/')
    .post(isLoggedIn,verifyToken, [
        check("name", "name is required").not().isEmpty(),
    ],makeCategory)
    .patch(isLoggedIn, verifyToken, [
        check("name", "name is required").not().isEmpty(),
        check("id", "id is required").not().isEmpty()
    ],updateCategory)
    .delete(isLoggedIn, verifyToken, [
        check("categoryId", "categoryId is required").not().isEmpty()
    ],deleteCategory);

//게시글 삭제
router.delete('/:postId/posts',isLoggedIn, verifyToken, [
    check("postId", "postId is required").not().isEmpty()
],adminPost);

//댓글 삭제
router.delete('/:commentId/comments',isLoggedIn,verifyToken, adminComment )

/**
 * @swagger
 *  /admin:
 *    post:
 *      tags:
 *      - 카테고리 생성(관리자)
 *      description: 카테고리 생성(관리자)
 *      produces:
 *      - swagger
 *      parameters:
 *        - in: body
 *          name: body
 *          
 *          
 *      responses:
 *       200:
 *        description: 카테고리 생성 성공
 *       400:
 *        description: 잘못된 요청
 *       500:
 *        description: 서버 에러
 */

 /**
 * @swagger
 *  /admin:
 *    patch:
 *      tags:
 *      - 카테고리 수정(관리자)
 *      description: 카테고리 수정(관리자)
 *      produces:
 *      - swagger
 *      parameters:
 *        - in: body
 *          name: body
 *          
 *          
 *      responses:
 *       200:
 *        description: 카테고리 생성 성공
 *       400:
 *        description: 잘못된 요청
 *       500:
 *        description: 서버 에러
 */

/**
 * @swagger
 *  /admin:
 *    delete:
 *      tags:
 *      - 카테고리 삭제(관리자)
 *      description: 카테고리 삭제정(관리자)
 *      produces:
 *      - swagger
 *      parameters:
 *        - in: body
 *          name: body
 *          
 *          
 *      responses:
 *       200:
 *        description: 카테고리 생성 성공
 *       400:
 *        description: 잘못된 요청
 *       500:
 *        description: 서버 에러
 */

 /**
 * @swagger
 *  /admin/{id}/posts:
 *    delete:
 *      tags:
 *      - 포스터 삭제(관리자)
 *      description: 포스터 삭제정(관리자)
 *      produces:
 *      - swagger
 *      parameters:
 *        - in: body
 *          name: body
 *        - name: id
 *          in: path
 *          
 *          
 *      responses:
 *       200:
 *        description: 포스터 생성 성공
 *       400:
 *        description: 잘못된 요청
 *       500:
 *        description: 서버 에러
 */

 /**
 * @swagger
 *  /admin/{commentId}/comments:
 *    delete:
 *      tags:
 *      - 댓글 삭제(관리자)
 *      description: 댓글 삭제정(관리자)
 *      produces:
 *      - swagger
 *      parameters:
 *        - in: body
 *          name: body
 *        - name: id
 *          in: path
 *          
 *      responses:
 *       200:
 *        description: 댓글 생성 성공
 *       400:
 *        description: 잘못된 요청
 *       500:
 *        description: 서버 에러
 */



 

module.exports = router;