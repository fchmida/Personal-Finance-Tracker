// Import express and ejs
var express = require ('express');
var ejs = require('ejs');
const router = express.Router();  // Initialize the router
var bodyParser= require ('body-parser');
const session = require('express-session');
const app = express(); //initialise app here before using it

//set up session middleware
app.use(session({
    secret: 'your-secret-key', // This should be a secret string
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // For development; in production, use `secure: true` with HTTPS
}));

app.use((req, res, next) => {
    res.locals.user = req.session.user || null; // Set `user` for all templates
    next();
});

//middleware to check if user is logged in
function checkAuthentication(req, res, next) {
    if (!req.session.user) {
        //redirect to login if user is not logged in
        return res.redirect('/users/login');
    }
    next(); //allow access to route if user is logged in
}

module.exports = { checkAuthentication };

// Use checkAuthentication globally for routes that need authentication
app.use("/dashboard", checkAuthentication);
app.use("/transactions", checkAuthentication);
app.use("/listusers", checkAuthentication);
app.use("/report", checkAuthentication);
app.use("/search", checkAuthentication);

//Import mysql module
var mysql = require('mysql2')

// Create the express application object
const port = 8000

// Tell Express that we want to use EJS as the templating engine
app.set('view engine', 'ejs')

// Set up the body parser 
app.use(express.urlencoded({ extended: true }))

// Set up public folder (for css and statis js)
app.use(express.static(__dirname + '/public'))

// Define the database connection
const db = mysql.createConnection ({
    host: 'localhost',
    user: 'user',
    password: 'password',
    database: 'personalFinanceTracker'
})
// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to database')
})
global.db = db

// Define our application-specific data
app.locals.financeData = {appName:"Personal Finance Tracker"};

// Load the route handlers
const mainRoutes = require("./routes/main")
app.use('/', mainRoutes)

// Load the route handlers for /users
const usersRoutes = require('./routes/users')
app.use('/users', usersRoutes)

// Start the web app listening
app.listen(port, () => console.log(`Node app listening on port ${port}!`))