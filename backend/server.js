const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const { connectDB } = require('./config/db');

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Start Server
connectDB().then((database) => {
  const orderRoutes = require('./routes/orderRoutes')(database); // ✅ Inject db
  const authRoutes = require('./routes/authRoutes')(database); // ✅ Inject db
  
  app.use('/orders', orderRoutes);
  app.use('/auth', authRoutes);


  app.listen(5500, () => {
    console.log("🚀 Server running on http://localhost:5500");
  });
});

