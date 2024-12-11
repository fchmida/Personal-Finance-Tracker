const express = require("express");
const router = express.Router();
const bcryptjs = require('bcryptjs');
const saltRounds = 10;

router.get('/login', function (req, res) {
    res.render('login.ejs'); //renders form not trigger attempts yet/ extract form data
});

router.post('/login', function (req, res) {
    const { username, password } = req.body;

    //ensure username + password provided
    if (!username || !password) {
        return res.status(400).send("Both username and password are required.");
    }

    //query db to find user by username
    const sql = "SELECT * FROM users WHERE username = ?";
    db.query(sql, [username], function (err, result) {
        if (err) {
            console.log('Error querying database:', err);
            return res.status(500).send("An error occured while checking your credentials.");
        }

        if(result.length === 0) {
            return res.status(401).send("User not found.");
        }

        //compare entered password with hashed password in db
        bcryptjs.compare(password, result[0].password_hash, function (err, isMatch) {
            if (err) {
                console.log('Error comparing passwords:', err);
                return res.status(500).send("An error occured during password comparsion.");
            }

            //if passwords match, create session and redirect to dashboard
            if(isMatch) {
                //store user info in session (e.g. username or userid)
                req.session.user = {
                    username: result[0].username,
                    name: result[0].name
                };

                //redirect to dashboard after login
                return res.redirect('/dashboard');
            } else {
                //if passwords dont match
                return res.status(401).send("Incorrect password.");
            }
    });
    });
});

//user logout
router.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
        if (err) {
            return res.status(500).send("An error occured during logout.");
        }
        res.redirect('/users/login'); //redirect to login after logout
    });
});

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
