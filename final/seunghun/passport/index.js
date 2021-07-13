const passport = require('passport');
const local = require('./localStrategy');
const User = require('../models/user');

module.exports = ()=>{
    //serializeUser -> 로그인 시 실행됨 
    //req.session 객체에 어떤 데이터를 저장할지 정함
    //user에 사용자 정보가 들어있음
    passport.serializeUser((user,done) => {
        done(null,user.id);
        //세션에 user.id만 저장
    });

    //deserializeUser -> 매 요청시 실행됨
    //passport.session 미들웨어가 호출하는 것으로 위의 id가 첫번쨰 인수가 됨
    passport.deserializeUser((id,done) =>{
        //위의 아이디를 받아 해당 아이디의 사용자가 있는지
        User.findOne({
            where:{ id }
        })
            .then(user => done(null,user))//req.user에 저장한 것임
            //라우터에서 req.user사용 가능함
            .catch(err => done(err));
    });

    //serializeUser는 사용자 정보 객체를 세션에 아이디로 저장,
    //deserializeUser는 그 아이디로 사용자 정보 객체를 불러오는 것

    local();
}