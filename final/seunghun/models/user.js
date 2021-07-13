const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            //아이디는 자동으로 설정
            email:{//이메일
                type: Sequelize.STRING(30),
                allowNull:true,
            },
            password:{//비밀번호
                type:Sequelize.STRING(100),
                allowNull:true,
            },
            nickName:{//닉네임
                type:Sequelize.STRING(15),
                allowNull:true,
            },
            Role:{//회원 권한
                type:Sequelize.ENUM('일반','관리자'),
                allowNull:true,
            },
            status:{
                type:Sequelize.ENUM('사용','삭제'),
                allownull:true,
            },
        },{
            sequelize,
            timestamps:true,//생성,수정 칼럼 자동화
            underscored:false,
            modelName:'User',
            tableName:'users',
            paranoid:false,//삭제 컬럼은 없이
            charset:'utf8',
            collate:'utf8_general_ci',
        });
    }
    static associate(db){
        db.User.hasMany(db.Post,{foreignKey:'Member',sourceKey:'id'});//회원은 여러 게시글 작성 가능
        db.User.hasMany(db.Comment,{foreignKey:'Member',sourceKey:'id'});//회원은 여러 댓글 작성 가능
    }
};