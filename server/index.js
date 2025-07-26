const express = require('express');
const dotenv = require('dotenv')
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// app.get('/', (req, res) => {
//   res.send('API is working 🎬');
// });
const authRoutes = require('./routes/authRoutes');
const movieRoutes = require('./routes/movieRoutes');
app.use('/movies', movieRoutes);

app.use('/auth', authRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
