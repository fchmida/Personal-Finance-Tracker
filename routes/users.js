const express = require("express");
const router = express.Router();
const bcryptjs = require('bcryptjs');
const saltRounds = 10;

const { check, validationResult } = require('express-validator');

// Middleware to redirect users to login if not authenticated
const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
        res.redirect('./login'); // Redirect to the login page
    } else {
        next(); // Move to the next middleware function
    }
};

router.get('/login', function (req, res) {
    const message = req.query.message === 'logged_out' ? 'You have been logged out.': null;
    res.render('login.ejs', { user: req.session.user, message });
});
// Login route
router.post('/login', function (req, res) {
    const username = req.sanitize(req.body.username);
    const password = req.body.password; // password doesn't need sanitization because it's hashed

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
                // Correctly set the session variables
                req.session.userId = result[0].user_id; // Save user ID in the session
                req.session.user = {
                    username: result[0].username,
                    name: result[0].name
                };

                // Redirect to about after successful login
                return res.redirect('/about');
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

router.post('/registered', [
    check('email').isEmail(),
    check('password').isLength({ min: 8 }).withMessage('Password must be 8 characters long.')
], function (req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.render('register.ejs', {
            errors: errors.array(),
            username: req.sanitize(req.body.username) || "",
            name: req.sanitize(req.body.name) || "",
            email: req.sanitize(req.body.email) || ""
        });
    }

    const username = req.sanitize(req.body.username);
    const name = req.sanitize(req.body.name);
    const email = req.sanitize(req.body.email);
    const password = req.body.password;

    if (!username || !name || !email || !password) {
        return res.status(400).send("All fields are required.");
    }

    bcryptjs.hash(password, saltRounds, function (err, hashedPassword) {
        if (err) {
            console.error('Error hashing password:', err);
            return res.status(500).send("An error occurred during password hashing.");
        }

        const sql = "INSERT INTO users (username, name, email, password_hash) VALUES (?, ?, ?, ?)";
        db.query(sql, [username, name, email, hashedPassword], function (err, result) {
            if (err) {
                console.error('Error inserting user data:', err);
                return res.status(500).send("An error occurred while saving your data.");
            }

            // Save user info in the session
            req.session.userId = result.insertId; // Use the auto-generated user ID
            req.session.user = {
                username: username,
                name: name
            };

            // Redirect to the about after successful registration
            res.redirect('/about');
        });
    });
});

module.exports = router;
