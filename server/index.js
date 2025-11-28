require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const apiRoutes = require('./routes/api');

app.use('/api', apiRoutes);

// Basic Health Check
app.get('/', (req, res) => {
    res.send('Basa Khuji Brain is Active 🧠');
});

// Connect to MongoDB
// For development, we can use a local instance or the user needs to provide a URI.
// I'll use a local fallback for now.
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/basa-khuji';
mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
