const express = require('express');
const dotenv = require('dotenv')

const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
const corsOptions = {
  origin: 'http://localhost:5173', // Replace with your frontend URL
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
const movieRoutes = require('./routes/movieroutes');
const router = require('./routes/movieroutes');
app.use('/movies',movieRoutes);
app.use('auth',authRoutes)



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
