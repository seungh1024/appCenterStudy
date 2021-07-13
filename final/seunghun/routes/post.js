const express = require('express');
const fs = require('fs');
const upload = require('../utils/s3');
const destroyImage = require('../utils/s3delete');

const {isLoggedIn, isNotLoggedIn , verifyToken} = require('./middlewares');
const {Post, Image, Comment } = require('../models');
const {check, validationResult} = require('express-validator');
const {makePost, updatePost, deletePost, postInfo, addPost, deleteImage} = require('../controllers/post');

const router = express.Router();


//게시글 생성
router.post('/',isLoggedIn, upload.array('imgs'),[
    check("content", "content is required").not().isEmpty(),
    check("categoryId", "categoryId is required").not().isEmpty(),
    check("title", "post is required").not().isEmpty(),
],  makePost)

//게시글 수정
router.patch('/update', isLoggedIn, upload.array('imgs'), updatePost)

//게시글 삭제
router.delete('/:postId',isLoggedIn, deletePost);

//게시글 상세 조회
router.get('/:postId',isLoggedIn, postInfo);

//게시글 이미지 추가(게시글의 이미지를 여러 개 추가 가능)
router.post('/addpost/:postId',isLoggedIn,upload.array('imgs'), addPost);

//게시글 이미지 삭제(게시글의 이미지를 한개씩 삭제)
router.delete('/:imageId/image',isLoggedIn, deleteImage)

/**
 * @swagger
 *  /post:
 *    post:
 *      tags:
 *      - 게시글 생성
 *      description: 게시글 생성
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
 *  /post/update:
 *    patch:
 *      tags:
 *      - 게시글 수정
 *      description: 게시글 수정
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
 *  /post/{postId}:
 *    delete:
 *      tags:
 *      - 게시글 삭제
 *      description: 게시글 삭제
 *      produces:
 *      - swagger
 *      parameters:
 *        - in: body
 *          name: body
 *        - name: postId
 *          in: path
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
 *  /post/{id}:
 *    get:
 *      tags:
 *      - 게시글 상세 조회
 *      description: 게시글 상세 조회
 *      produces:
 *      - swagger
 *      parameters:
 *        - name: id
 *          in: path
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
 *  /post/addpost/{id}:
 *    post:
 *      tags:
 *      - 게시글 이미지 추가
 *      description: 게시글 이미지 추가
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
 *        description: 페이징 요청 성공
 *       400:
 *        description: 잘못된 요청
 *       500:
 *        description: 서버 에러
 */

 /**
 * @swagger
 *  /post/{postId}/image:
 *    delete:
 *      tags:
 *      - 게시글 이미지 삭제
 *      description: 게시글 이미지 삭제
 *      produces:
 *      - swagger
 *      parameters:
 *        - in: body
 *          name: body
 *        - name: postId
 *          in: path
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

module.exports = router;