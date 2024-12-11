const express = require("express");
const router = express.Router();
const bcryptjs = require('bcryptjs');
// const db = require('./db'); // Import db connection
const saltRounds = 10;

router.get('/login', function (req, res) {
    res.render('login.ejs');
});

router.get('/users/list', function (req, res) {
    //query to fetch user data without passwords
    
})

// Render the registration page
router.get('/register', function (req, res) {
    res.render('register.ejs');
});

// Handle user registration
router.post('/registered', function (req, res) {
    const { username, name, email, password } = req.body; // Extract form data

    // Ensure all fields are present in the request body
    if (!username || !name || !email || !password) {
        return res.status(400).send("All fields are required.");
    }

    // Hash password before storing
    bcryptjs.hash(password, saltRounds, function (err, hashedPassword) {
        if (err) {
            console.log('Error hashing password:', err);
            return res.status(500).send("An error occurred during password hashing. Please try again.");
        }

        // Insert user data into the database
        const sql = "INSERT INTO users (username, name, email, password_hash) VALUES (?, ?, ?, ?)";
        const newUser = [username, name, email, hashedPassword];

        db.query(sql, newUser, (err, result) => {
            if (err) {
                console.log('Error inserting user data:', err);
                return res.status(500).send("An error occurred while saving your data. Please try again.");
            }
            res.send(`Hello ${name}, you are now registered! We will send an email to ${email}.`);
        });
    });
});


// Export the router object so index.js can access it
module.exports = router;
