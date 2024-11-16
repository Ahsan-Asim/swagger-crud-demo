const express = require('express');
const User = require('../Models/user');
const authorize = require('../middleware/auth');  // Import the authorization middleware
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');  // Ensure bcrypt is required for password hashing


/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: Operations related to managing users
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     description: Create a new user with details.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [admin, user]
 *               age:
 *                 type: number
 *               address:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *               - role
 *               - age
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid input
 */
router.post('/', async (req, res) => {
  const { firstName, lastName, email, password, role, age, address, phoneNumber } = req.body;
  const newUser = new User({ firstName, lastName, email, password, role, age, address, phoneNumber });

  try {
    const user = await newUser.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     description: Fetch all registered users.
 *     tags: [Users]
 *     security:
 *       - Authorization: []  # This route requires a valid token
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of users per page for pagination
 *     responses:
 *       200:
 *         description: List of users
 *       500:
 *         description: Internal server error
 */
router.get('/', authorize, async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // You can use these query parameters for pagination
  try {
    const users = await User.find()
      .skip((page - 1) * limit)
      .limit(limit);
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user's information
 *     description: Update the details of a specific user by ID.
 *     tags: [Users]
 *     security:
 *       - Authorization: []  # This route requires a valid token
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The user ID to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [admin, user]
 *               age:
 *                 type: number
 *               address:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: User not found
 */
router.put('/:id', authorize, async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, password, role, age, address, phoneNumber } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { firstName, lastName, email, password, role, age, address, phoneNumber },
      { new: true } // Return the updated user
    );
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /users:
 *   delete:
 *     summary: Delete a user by email
 *     description: Deletes a specific user from the database by email.
 *     tags: [Users]
 *     security:
 *       - Authorization: []  # This route requires a valid token
 *     parameters:
 *       - in: query
 *         name: email
 *         required: true
 *         description: The email of the user to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
router.delete('/', authorize, async (req, res) => {
  const { email } = req.query;  // Get the email from query parameters

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    // Find and delete the user by email
    const deletedUser = await User.findOneAndDelete({ email });
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


/////
/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: Operations related to user signup and login
 */

/**
 * @swagger
 * /api/users/signup:
 *   post:
 *     summary: User Signup
 *     description: Registers a new user and returns a JWT token.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [admin, user]
 *               age:
 *                 type: number
 *               address:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *               - role
 *               - age
 *     responses:
 *       201:
 *         description: User successfully created
 *       400:
 *         description: Invalid input
 */

// User Signup
router.post('/signup', async (req, res) => {
  const { firstName, lastName, email, password, role, age, address, phoneNumber } = req.body;
  
  try {
    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with hashed password
    const newUser = new User({ 
      firstName, 
      lastName, 
      email, 
      password: hashedPassword, 
      role, 
      age, 
      address, 
      phoneNumber 
    });

    // Save the user to the database
    const user = await newUser.save();

    // Create a JWT token after successful user creation
    const token = jwt.sign({ userId: user._id, role: user.role }, 'your_jwt_secret_key', { expiresIn: '1h' });
    
    // Respond with the token
    res.status(201).json({ token });  // Return token on successful signup
  } catch (err) {
    // Handle errors
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: User Login
 *     description: Authenticates a user and returns a JWT token.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token
 *       400:
 *         description: Invalid credentials
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);  // Compare hashed password
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, role: user.role }, config.jwtSecret, { expiresIn: '1h' });

    res.status(200).json({ token });  // Return the token
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
