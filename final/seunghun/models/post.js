const Sequelize = require('sequelize');

module.exports = class Post extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            //아이디는 자동으로 설정
            title:{//제목
                type:Sequelize.STRING(20),
                allowNull: true,
            },
            content:{//내용
                type:Sequelize.STRING,
                allowNull:true,
            },

        },{
            sequelize,
            timestamps:true,//생성,수정 칼럼 자동화
            underscored:false,
            modelName:'Post',
            tableName:'posts',
            paranoid:false,//삭제 컬럼은 없이
            charset:'utf8',
            collate:'utf8_general_ci',
        });
    }
    static associate(db){
        db.Post.hasMany(db.Comment,{foreignKey:'post',sourceKey:'id',onDelete:'cascade'});//게시글은 댓글 여러개 가짐
        db.Post.hasMany(db.Image,{foreignKey:'post',sourceKey:'id',onDelete:'cascade'});//게시글은 이미지 여러개 가짐
        db.Post.belongsTo(db.User,{foreignKey:'Member',targetKey:'id'});//게시글은 회원에 의해 여러개 생성됨
        db.Post.belongsTo(db.Category,{foreignKey:'category',targetKey:'id',onDelete:'cascade'});//여러 게시글은 한 카테고리에 포함됨
    }
};