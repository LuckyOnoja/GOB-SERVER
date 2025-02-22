const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


// CORS configuration
//const corsOptions = {
 // origin: [process.env.CLIENT_NAME, process.env.LOCAL_CLIENTNAME], 
 // methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
 // credentials: true, 
//};
//app.use(cors(corsOptions));

const corsOptions = {
  origin: '*', // Allow all origins (for testing only)
};
app.use(cors(corsOptions));
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
const transactionRoutes = require('./routes/transactionRoutes');

app.use('/propeneer', propeneerRoutes);
app.use('/payment', paymentRoute);
app.use('/user', userRoutes);
app.use('/transactions', transactionRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});