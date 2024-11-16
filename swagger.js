// src/swagger.js
const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'User API',
      version: '1.0.0',
      description: 'User management API',
    },
    components: {
      securitySchemes: {
        Authorization: {
          type: 'apiKey',
          in: 'header',
          name: 'Authorization',
          description: 'Enter JWT token in the format: Bearer <token>',
        },
      },
    },
    security: [
      {
        Authorization: [],
      },
    ],
    servers: [
      {
        url: 'http://localhost:5000',
      },
    ],
  },
  apis: ['./Routers/user.js'],
};


const swaggerDocs = swaggerJsdoc(swaggerOptions);

module.exports = swaggerDocs;
