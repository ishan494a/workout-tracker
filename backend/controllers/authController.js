const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();


// Register function: Checks if user exists, send 400 server code if user already exists, 500 for ISE and 200 if user is registered
const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: 'Username is already taken.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword
    });


    res.status(201).json({ message: 'User registered successfully', user: newUser });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login function: Check if password in record matches the password provides, return 200 if success and generate jwt, 400 if reject, 500 for ISE
const login = async(req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({where : { username }});
    if(!existingUser){
      return res.status(400).json({message: 'User does not exist'}); // CHANGE LATER FOR SECURITY
    }
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if(!isPasswordValid){
      return res.status(400).json({message: 'Incorrect Password'}); // CHANGE LATER FOR SECURITY
    }
    // Generate jwt token
    const token = jwt.sign(
      {id: existingUser.id, username: existingUser.username},
      process.env.JWT_SECRET
    )
    res.status(200).json({message: 'Login successful', token});
  } catch (error){
    console.error(error);
    res.status(500).json({ message : 'Internal Server Error'});
  }
}

module.exports = {
  register,
  login,
};