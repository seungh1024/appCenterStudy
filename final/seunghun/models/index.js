const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];

const User = require('./user');
const Post = require('./post');
const Category = require('./category');
const Comment = require('./comment');
const Image = require('./image');

const db ={};

const sequelize = new Sequelize(config.databse, config.username, config.password,config);
db.sequelize = sequelize;

//db객체를 이용하여 아래 모델들에 접근 가능하게 함
db.User = User;
db.Post = Post;
db.Category = Category;
db.Comment = Comment;
db.Image = Image;

//각 모델의 static.init메서드를 호출 ->init 실행이 되어야 테이블이 모델로 연결됨
User.init(sequelize);
Post.init(sequelize);
Category.init(sequelize);
Comment.init(sequelize);
Image.init(sequelize);

//associate로 설정한 관계 연결함
User.associate(db);
Post.associate(db);
Category.associate(db);
Comment.associate(db);
Image.associate(db);

module.exports = db;