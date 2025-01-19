const express = require('express');
const cors = require('cors');
const authRoute = require('./routes/authRoutes.js'); 
const userRoute = require('./routes/userRoutes.js'); 
const templateRoutes = require('./routes/templateRoutes.js')
const authMiddleware = require('./middleware/authMiddleware.js');
require('dotenv').config();
const connectDB = require('./config/db.js');
const app = express();

connectDB();
app.use(cors());
app.use(express.json()); 

app.use('/auth', authRoute);
app.use('/templates', authMiddleware, (templateRoutes));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});