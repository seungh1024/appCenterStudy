const express = require('express');

const{isLoggedIn,isNotLoggedIn, verifyToken}=require('./middlewares');
const {check} = require('express-validator');
const destroyImage = require('../utils/s3delete');
const { Update, Delete, getPost, writeComment, updateComment, deleteComment, Info } = require('../controllers/user');

const router = express.Router();

//회원 수정라우터
router.patch('/',isLoggedIn, [
    check("password", "Password is required").not().isEmpty(),
], Update);
/**
 * @swagger
 *  /user:
 *    patch:
 *      tags:
 *      - 회원 수정
 *      description: 회원 수정
 *      produces:
 *      - swagger
 *      parameters:
 *        - in: body
 *          name: body
 *          
 *          
 *      responses:
 *       200:
 *        description: 회원 수정 성공
 *       400:
 *        description: 잘못된 요청
 *       500:
 *        description: 서버 에러
 */

//회원 탈퇴 사용자 상태 칼럼이 있어서 컬럼만 바꾸는 것으로 함
router.delete('/:userId',isLoggedIn, Delete);
/**
 * @swagger
 *  /user/{userId}:
 *    delete:
 *      tags:
 *      - 회원 탈퇴
 *      description: 회원 탈퇴
 *      produces:
 *      - swagger
 *      parameters:
 *        - in: body
 *          name: body
 *        - name: userId
 *          in: path
 *          
 *          
 *      responses:
 *       200:
 *        description: 회원 수정 성공
 *       400:
 *        description: 잘못된 요청
 *       500:
 *        description: 서버 에러
 */

//회원 상세 조회
router.get('/info',isLoggedIn,  Info);
/**
 * @swagger
 *  /user/info:
 *    get:
 *      tags:
 *      - 게시글 생성
 *      description: 게시글 생성
 *      produces:
 *      - swagger
 *          
 *          
 *      responses:
 *       200:
 *        description: 회원 수정 성공
 *       400:
 *        description: 잘못된 요청
 *       500:
 *        description: 서버 에러
 */

//회원의 게시글 조회
router.get('/posts',isLoggedIn,  getPost);
/**
 * @swagger
 *  /user/posts:
 *    get:
 *      tags:
 *      - 회원 게시글 조회
 *      description: 회원 게시글 조회
 *      produces:
 *      - swagger
 *          
 *          
 *      responses:
 *       200:
 *        description: 회원 수정 성공
 *       400:
 *        description: 잘못된 요청
 *       500:
 *        description: 서버 에러
 */


//댓글 생성
router.post('/comments',isLoggedIn,[
    check("content", "content is required").not().isEmpty(),
    check("postId", "postId is required").not().isEmpty(),
], writeComment)
/**
 * @swagger
 *  /user/comments:
 *    post:
 *      tags:
 *      - 회원 댓글 생성
 *      description: 회원 댓글 생성
 *      produces:
 *      - swagger
 *      parameters:
 *        - in: body
 *          name: body
 *          
 *          
 *      responses:
 *       200:
 *        description: 회원 수정 성공
 *       400:
 *        description: 잘못된 요청
 *       500:
 *        description: 서버 에러
 */

//댓글 수정
router.patch('/:commentId',isLoggedIn, [
    check("content", "content is required").not().isEmpty(),
], updateComment);
/**
 * @swagger
 *  /user/{commentId}:
 *    patch:
 *      tags:
 *      - 회원 댓글 수정 
 *      description: 회원 댓글 수정
 *      produces:
 *      - swagger
 *      parameters:
 *        - in: body
 *          name: body
 *        - name: commentId
 *          in: path
 *          
 *          
 *      responses:
 *       200:
 *        description: 댓글 수정 성공
 *       400:
 *        description: 잘못된 요청
 *       500:
 *        description: 서버 에러
 */

//댓글 삭제
router.delete('/comments/:commentId',isLoggedIn,  deleteComment);
/**
 * @swagger
 *  /user/comments/{commentId}:
 *    delete:
 *      tags:
 *      - 회원 댓글 삭제
 *      description: 회원 댓글 삭제
 *      produces:
 *      - swagger
 *      parameters:
 *        - in: body
 *          name: body
 *        - name: commentId
 *          in: path
 *          
 *          
 *      responses:
 *       200:
 *        description: 삭제 성공
 *       400:
 *        description: 잘못된 요청
 *       500:
 *        description: 서버 에러
 */


module.exports = router;