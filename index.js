// Import express and ejs
const express = require('express');
const ejs = require('ejs');
const session = require('express-session');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express(); // Initialize app here before using it
const port = 8000;

// Set up session middleware
app.use(session({
    secret: 'your-secret-key', // This should be a secret string
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // For development; use secure: true with HTTPS in production
}));

// Set up middleware to make `user` accessible in all templates
app.use((req, res, next) => {
    res.locals.user = req.session.user || null; // Set `user` for all templates
    next();
});

// Middleware for parsing request body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Set up the public folder for static files
app.use(express.static(__dirname + '/public'));

// Define the database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'user',
    password: 'password',
    database: 'personalFinanceTracker'
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to database');
});
global.db = db;

// Define our application-specific data
app.locals.financeData = {appName:"Personal Finance Tracker"};

// Load route handlers
const mainRoutes = require("./routes/main");
app.use('/', mainRoutes);

const usersRoutes = require('./routes/users');
app.use('/users', usersRoutes);

// Start the server
app.listen(port, () => console.log(`Node app listening on port ${port}!`));
