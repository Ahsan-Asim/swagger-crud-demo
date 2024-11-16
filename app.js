// app.js
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const { connectMongoDb } = require('./connection');
const userRoutes = require('./Routers/user');
const swaggerDocs = require('./swagger');  // Import swagger.js

// Initialize the app
const app = express();
app.use(express.json());

// Connect to MongoDB
connectMongoDb('mongodb://localhost:27017/swagger-crud-demo');

// Swagger setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs)); // Serve Swagger UI

// Use user routes for handling user-related operations
app.use('/api/users', userRoutes);

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
