User Management API with Swagger Documentation and JWT Authentication
Project Structure

/project-root
│
├── /Models
│ └── user.js # Mongoose model for the User
│
├── /Routes
│ └── user.js # Routes to handle user-related CRUD operations
│
├── /Middleware
│ └── auth.js # Middleware for JWT authorization
│
├── /Controllers
│ └── authController.js # Handle authentication (signup, login)
│
├── /Config
│ └── db.js # Database connection file
│ └── config.js # JWT and other configuration
│
├── /Swagger
│ └── swagger.json # Swagger API documentation
│
├── /node_modules # NPM packages and dependencies
├── package.json # Project metadata and dependencies
├── .gitignore # Files to be ignored by Git
├── server.js # Main entry point to start the server
└── README.md # Project documentation (this file)

Step 1: Set Up Your Project

1. Clone the Repository
   To get started, clone the repository to your local machine using the following command:
   git clone https://github.com/your-username/project-repo.git

cd project-repo 2. Install Dependencies
Run the following command to install all the necessary dependencies:
npm install

This will install required dependencies such as Express, Mongoose, JWT, and other necessary packages.

Step 2: Setting Up Swagger
Swagger is used to document and test the API. Follow these steps to integrate and configure Swagger for your project:

1. Install Swagger Dependencies
   If Swagger is not already installed, you need to add the following dependencies:
   npm install swagger-jsdoc swagger-ui-express

2. Configure Swagger Documentation
   In your server.js file, set up Swagger by importing necessary modules and configuring Swagger options for your API. You also need to integrate Swagger UI for testing and viewing your API documentation. Swagger documentation for your routes should already be defined in the /Routes/user.js file using Swagger annotations (e.g., @swagger).

3. Access Swagger UI
   Once your server is running, you can view the API documentation and interact with your API at:
   http://localhost:5000/api-docs

Step 3: Implementing CRUD Operations for Users
Your API handles CRUD operations (Create, Read, Update, and Delete) for users. The following routes are set up in the /Routes/user.js file:

1. Create a User
   Route: POST /users
   Action: Creates a new user in the database.
2. Get All Users
   Route: GET /users
   Action: Fetches a list of all users with pagination.
3. Update a User
   Route: PUT /users/:id
   Action: Updates a user's information by ID.
4. Delete a User
   Route: DELETE /users/:id
   Action: Deletes a specific user by ID.
   Step 4: Setting Up JWT Authorization
   This setup secures your API endpoints using JWT (JSON Web Tokens). The following steps will help in configuring JWT:

5. Install JWT Dependencies
   Run the following command to install JWT-related dependencies:
   npm install jsonwebtoken bcryptjs

6. Create Middleware for JWT Authorization
   In the /Middleware/auth.js file, create a middleware that checks for a valid JWT token. This middleware will be used to protect routes that require authentication (e.g., updating or deleting users).

7. Protect Routes with Authorization
   In your /Routes/user.js file, make sure that routes like update and delete are protected by JWT. For example:

router.put('/:id', authorize, async (req, res) => {
// Code for updating a user
});

router.delete('/:id', authorize, async (req, res) => {
// Code for deleting a user
});
This ensures that only users with a valid token can access these routes.

Step 5: Signup and Login to Get the Token
Before performing any protected operations (like deleting a user), you need to sign up or log in to get a JWT token.

1. User Signup
   Route: POST /api/users/signup
   Action: Registers a new user and returns a JWT token.
   Run the following curl command to sign up a new user and get the token:
   curl -X POST http://localhost:5000/api/users/signup -H "Content-Type: application/json" -d '{"email": "user@example.com", "password": "password123", "role": "user"}'

The response will contain a JWT token. Keep this token for making authorized requests.

2. User Login
   Route: POST /api/users/login
   Action: Authenticates an existing user and returns a JWT token.
   Run the following curl command to log in and obtain a token:

curl -X POST http://localhost:5000/api/users/login -H "Content-Type: application/json" -d '{"email": "user@example.com", "password": "password123"}'

Step 6: Using the Token to Perform Protected Actions
Now that you have the JWT token, you can use it to perform actions like deleting a user.

1. Delete User by Email
   To delete a user, use the following curl command:
   curl -X DELETE http://localhost:5000/users/{email} -H "Authorization: Bearer {your-token}"
   Replace {email} with the user's email address and {your-token} with the token you received during login or signup.

The server will verify the token and, if valid, will delete the user.

Step 7: Run the Server
To start your server and test the API, run the following command:

npm start
This will start the server on http://localhost:5000 by default.
