// importing packages
const express = require('express');
const http = require('http');
const dotenv = require('dotenv');
const cors = require('cors');
const fetch = require('node-fetch'); // Adding this line for fetch API usage

// importing db config
const connectDB = require('./config/db');
// importing routes
const authRoutes = require('./routes/auth');
const documentRoutes = require('./routes/documents');

dotenv.config();
connectDB();

const app = express();

// Configure CORS for HTTP requests
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Allowed headers
}));

// Middleware to parse JSON
app.use(express.json());

// Define routes
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);

// Define a route for the root URL
app.get('/', (req, res) => {
    res.send('Welcome to the API');
});

// Call the documents API endpoint
app.get('/getDocuments', (req, res) => {
    fetch('http://localhost:5000/api/documents')
        .then(response => response.json())
        .then(data => res.json(data))
        .catch(error => {
            console.error('Error:', error);
            res.status(500).send('Error fetching documents');
        });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
