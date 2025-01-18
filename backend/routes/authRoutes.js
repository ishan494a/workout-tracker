const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController.js');
const authMiddleware = require('../middleware/authMiddleware.js');

// jwt is generated and returned in the json body, store in frontend
router.post('/login', authController.login);
router.post('/register', authController.register);

// EXAMPLE FOR LATER USE
router.post('/protected', authMiddleware, (req, res) => {
  res.json({ message: 'You have access!', user: req.user });
});

module.exports = router;
