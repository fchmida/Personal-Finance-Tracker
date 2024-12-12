const express = require("express");
const router = express.Router();
const bcryptjs = require('bcryptjs');
const saltRounds = 10;

// Middleware to redirect users to login if not authenticated
const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
        res.redirect('./login'); // Redirect to the login page
    } else {
        next(); // Move to the next middleware function
    }
};

// Login route
router.get('/login', function (req, res) {
    const message = req.query.message === 'logged_out' ? 'You have been logged out.': null;
    res.render('login.ejs', { user: req.session.user, message });
});

router.post('/login', function (req, res) {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send("Both username and password are required.");
    }

    const sql = "SELECT * FROM users WHERE username = ?";
    db.query(sql, [username], function (err, result) {
        if (err) {
            console.error('Error querying database:', err);
            return res.status(500).send("An error occurred while checking your credentials.");
        }

        if (result.length === 0) {
            return res.status(401).send("User not found.");
        }

        bcryptjs.compare(password, result[0].password_hash, function (err, isMatch) {
            if (err) {
                console.error('Error comparing passwords:', err);
                return res.status(500).send("An error occurred during password comparison.");
            }

            if (isMatch) {
                req.session.userId = username; // Save user session
                req.session.user = {
                    username: result[0].username,
                    name: result[0].name
                };
                return res.redirect('/dashboard');
            } else {
                return res.status(401).send("Incorrect password.");
            }
        });
    });
});

// Logout route
router.get('/logout', function (req, res) {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send("An error occurred during logout.");
        }
        res.redirect('./login?message=logged_out');
    });
});

// Registration routes
router.get('/register', function (req, res) {
    res.render('register.ejs');
});

router.post('/registered', function (req, res) {
    const { username, name, email, password } = req.body;

    if (!username || !name || !email || !password) {
        return res.status(400).send("All fields are required.");
    }

    bcryptjs.hash(password, saltRounds, function (err, hashedPassword) {
        if (err) {
            console.error('Error hashing password:', err);
            return res.status(500).send("An error occurred during password hashing.");
        }

        const sql = "INSERT INTO users (username, name, email, password_hash) VALUES (?, ?, ?, ?)";
        db.query(sql, [username, name, email, hashedPassword], (err) => {
            if (err) {
                console.error('Error inserting user data:', err);
                return res.status(500).send("An error occurred while saving your data.");
            }
            res.send(`Hello ${name}, you are now registered!`);
        });
    });
});

module.exports = router;
