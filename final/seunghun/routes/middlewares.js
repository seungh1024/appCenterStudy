const jwt = require('jsonwebtoken');
// const reqbody = require('./validation/validate');
// const {check, validationResult } = require('express-validator');

exports.isLoggedIn = (req,res,next)=>{
    if(req.isAuthenticated()){
        next();
    }else{
        res.status(403).send('로그인 필요');
    }
};
//로그인 중이면 req.isAuthenticated() 가 true, 아니면 false
//로그인 여부를 이 메서드로 파악함

exports.isNotLoggedIn = (req,res,next) =>{
    if(!req.isAuthenticated()){
        next();
    }else{
        res.send('로그인한 상태');
    }
};
exports.verifyToken = (req,res,next) =>{
    try{
        //요청 헤더에 저장된 토큰 -> req.headers.authorization 사용
        //사용자가 쿠키처럼 헤더에 토큰을 넣어 보내는 것
        //jwt.verify 메서드로 토큰 검증
        //첫 인수로 토큰, 두 번째 인수로 비밀키를 넣어서 인증함
        //인증 성공시 req.decoded에 저장
        req.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
        return next();
    }catch(error){
        if(error.name === 'TokenExpiredError'){//유효 기간 초과된 경우
            delete req.headers.authorization;//만료시 헤더 토큰 삭제
            //클라측에서 해야 하는 것 같음
            return res.status(419).json({
                code:419,
                message:'토큰이 만료되었습니다.',
            });
        }
        return res.status(401).json({
            code:401,
            message: '유효하지 않은 토큰입니다',
        })
    }
};




