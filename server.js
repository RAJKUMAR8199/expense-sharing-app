require('dotenv').config(); // 👈 THIS MUST BE THE VERY FIRST LINE
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // If you added cors earlier
const apiRoutes = require('./routes/api');

const app = express();

app.use(express.json());
app.use(cors());

// --- CONNECT TO DB SECURELY ---
// We use the variable from .env here
mongoose.connect(process.env.MONGO_URI) 
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ DB Connection Error:', err));

app.use('/api', apiRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));