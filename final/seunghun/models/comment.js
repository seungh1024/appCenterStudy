const Sequelize = require('sequelize');

module.exports = class Comment extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            //아이디는 자동으로 설정
            content:{
                type:Sequelize.STRING,
                allowNull:true,
            },
        },{
            sequelize,
            timestamps:true,//생성,수정 칼럼 자동화
            underscored:false,
            modelName:'Comment',
            tableName:'comments',
            paranoid:false,//삭제 컬럼은 없이
            charset:'utf8',
            collate:'utf8_general_ci',
        });
    }
    static associate(db){
        db.Comment.belongsTo(db.User,{foreignKey:'Member',targetKey:'id'});//회원이 댓글 여러개 가짐
        db.Comment.belongsTo(db.Post,{foreignKey:'post',targetKey:'id',onDelete:'cascade'});//게시글이 댓글 여러개 가짐
    }
};