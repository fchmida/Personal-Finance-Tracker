// Import express and ejs
var express = require ('express')
var ejs = require('ejs')
var bodyParser= require ('body-parser')

//Import mysql module
var mysql = require('mysql2')

// Create the express application object
const app = express()
const port = 8000
app.use(bodyParser.urlencoded({ extended: true }))

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