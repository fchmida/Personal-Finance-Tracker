const express = require("express");
const router = express.Router();
const bcryptjs = require('bcryptjs');
// const db = require('./db'); //import db connection
const saltRounds = 10;

router.get('/register', function (req, res) {
    res.render('register.ejs')                                                             
})    

router.post('/login',function(req, res){
    res.render('login.ejs')
})

router.post('/registered', function (req, res, next) {
    const { username, name, email, password } = req.body; //extract form data
    const plainPassword = password; //extract plain text password from form data

    if (!username || !name || !email || !password) {
        return res.status(400).send("All fields are required.");
    }
    //hash password before storing
    bcryptjs.hash(plainPassword, saltRounds, function(err, hashedPassword) {
        if (err) {
            //handle any hashing error
            console.log('Error hashing password:', err);
            res.status(500).send("An error occured during password hashing. Please try again.");
        } else {
            //insert user data into db
            const sql = "INSERT INTO users (username, name, email, password_hash) VALUES (?, ?, ?, ?)";

    const newUser = [req.body.username, req.body.name, req.body.email, hashedPassword];

    db.query(sql, newUser, (err, result) => {
        if (err) {
            console.log('Error inserting user data:', err);
            res.status(500).send("An error occured while saving your data. Please try again.");
        } else {
            res.send(`Hello ${name}, you are now registered! We will send an email to ${email}.`);

        }
    });
}
    });
});

// Export the router object so index.js can access it
module.exports = router