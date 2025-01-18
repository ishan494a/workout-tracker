const express = require('express');
const cors = require('cors');
const authRoute = require('./routes/authRoutes.js'); 
const userRoute = require('./routes/userRoutes.js'); 
require('dotenv').config();
const app = express();

app.use(cors());
app.use(express.json()); 

app.use('/auth', authRoute);
app.use('/user', userRoute);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});