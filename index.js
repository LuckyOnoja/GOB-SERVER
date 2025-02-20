const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI,)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Routes
app.get('/', (req, res) => {
  res.send('Global Online Banking API');
});

const propeneerRoutes = require('./routes/propeneerRoutes');
const paymentRoute = require('./routes/paymentRoute');
const userRoutes = require('./routes/userRoutes');

app.use('/propeneer', propeneerRoutes);
app.use('/payment', paymentRoute);
app.use('/user', userRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});