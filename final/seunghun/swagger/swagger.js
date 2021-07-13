const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const router = require('../routes/user');

const options = {
    swaggerDefinition:{
        info:{
            title: 'Test API',
            version: '1.0.0',
            description: 'Test API with express',
        },
        host: 'localhost:8001',
        basePath:'/'
    },
    apis:['./routes/*.js','./swagger/*']
};

const specs = swaggerJsdoc(options);

module.exports = {
    swaggerUi,
    specs
}
