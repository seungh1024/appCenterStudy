const Sequelize = require('sequelize');

module.exports = class Image extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            //아이디는 자동으로 설정
            storeName:{//저장이름
                type:Sequelize.STRING,
                allowNull:true,
            },
            imageUrl:{//이미지 원본 URL
                type:Sequelize.STRING,
                allowNull:true,
            },
            thumbnailImageUrl:{//이미지 사본 URL
                type:Sequelize.STRING,
                allowNull:true,
            },
            createdAt:{
                type:Sequelize.DATE,
                defaultValue:Sequelize.NOW(),
            }
        },{
            sequelize,
            timestamps:false,//생성,수정 칼럼 없이
            underscored:false,
            modelName:'Image',
            tableName:'images',
            paranoid:false,//삭제 컬럼은 없이
            charset:'utf8',
            collate:'utf8_general_ci',
        });
    }
    static associate(db){
        db.Image.belongsTo(db.Post,{foreignKey:'post',targetKey:'id',onDelete:'cascade'});//이미지 여러개는 한 게시글에 포함됨
    }
};