const Sequelize = require('sequelize');

module.exports = class Category extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            //아이디는 자동으로 설정
            name:{//카테고리 이름
                type:Sequelize.STRING(20),
                allowNull:true,
            }
        },{
            sequelize,
            timestamps:true,//생성,수정 칼럼 자동화
            underscored:false,
            modelName:'Category',
            tableName:'categories',
            paranoid:false,//삭제 컬럼은 없이
            charset:'utf8',
            collate:'utf8_general_ci',
        });
    }
    static associate(db){
        db.Category.hasMany(db.Post,{foreignKey:'category',sourceKey:'id',onDelete:'cascade'});//카테고리는 여러 게시글 가질 수 있음
        
    }
};

