const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const User = require('../models/user');

module.exports = () =>{
    passport.use(new LocalStrategy({
        //첫 번째 인수로 주어진 객체는 로그인 전략 설정을 해줌
        usernameField: 'email',
        passwordField: 'password',
        //각 필드에는 user모델의 아이디 비밀번호 정보를 넣는다고 생각
    },async(email, password, done) => {
        //async 함수에서 실제 전력 수행함
        //첫 번째 인수에서 넣어준 이메일,비밀번호가 async함수의 1,2번째 매개변수가 되는 것
        //done 함수는 passport.authenticate의 콜백 함수임
        try{
            const exUser = await User.findOne({
                where: {email} 
            });
            if(exUser){//일치하는 이메일을 먼저 찾은 후
                const result = await bcrypt.compare(password, exUser.password);
                //암호화한 비밀번호와 비교함
                if(result){//비밀번호까지 일치할 때
                    //done 함수의 두 번째 인수로 사용자 정보를 넣어서 보냄
                    done(null, exUser);
                }else{
                    //두 번째 인수를 사용하지 않을 때 ->로그인 실패했을 경우 뿐
                    done(null, false, {message: '비밀번호가 일치하지 않음'});
                }
            }else{//일치하는 이메일 없으면 가입하지 않은 것
                done(null, false, {message: '가입되지 않은 회원'});
            }
        }catch(error){
            console.error(error);
            done(error);
        }
    }));
};