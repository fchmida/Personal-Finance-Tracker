const express = require("express");
const router = express.Router();

// Middleware to redirect users to login if not authenticated
const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
        res.redirect('./login'); // Redirect to the login page
    } else {
        next(); // Move to the next middleware function
    }
};

// Home page (public access)
router.get('/', function (req, res) {
    res.render('index.ejs');
});

// About page (public access)
router.get('/about', function (req, res) {
    res.render('about.ejs');
});

// Protected routes
router.get('/listusers', redirectLogin, function (req, res) {
    const sql = "SELECT user_id, username, name, email FROM users";
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).send("An error occurred while fetching user data.");
        }
        res.render('listusers.ejs', { users: results });
    });
});

// Dashboard page (protected)
router.get('/dashboard', redirectLogin, function (req, res) {
    res.render('dashboard.ejs', { user: req.session.user });
});

// Transactions page (protected)
router.get('/transactions', redirectLogin, function (req, res) {
    db.query('SELECT * FROM transactions', (err, results) => {
        if (err) {
            console.error('Error fetching transactions', err);
            return res.status(500).send('Server Error');
        }
        res.render('transactions.ejs', { transactions: results });
    });
});

// Add transaction (protected)
router.post('/transaction/add', redirectLogin, function(req, res) {
    const { description, amount, type } = req.body;
    db.query(
        'INSERT INTO transactions (description, amount, type) VALUES (?, ?, ?)',
        [description, amount, type],
        (err) => {
            if (err) {
                console.error('Error adding transaction:', err);
                return res.status(500).send('Server Error');
            }
            res.redirect('/transactions');
        }
    );
});
 
// Edit transaction (protected)
router.get('/transactions/edit/:id', redirectLogin, function(req, res) {
    const transactionId = req.params.id;
    db.query('SELECT * FROM transactions WHERE transaction_id = ?', [transactionId], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error fetching transaction');
        } else {
            res.render('edit-transaction', { transaction: results[0] });
        }
    });
});


// Update transaction (protected)
router.post('/transaction/edit/:id', redirectLogin, function(req, res) {
    const { id } = req.params;
    const { description, amount, type } = req.body;
    db.query(
        'UPDATE transactions SET description = ?, amount = ?, type = ? WHERE transaction_id = ?',
        [description, amount, type, id],
        (err) => {
            if (err) {
                console.error('Error updating transaction:', err);
                return res.status(500).send('Server Error');
            }
            res.redirect('/transactions');
        }
    );
});


// Delete transaction (protected)
router.post('/transactions/delete/:id', redirectLogin, function(req, res) {
    const { id } = req.params;
    db.query('DELETE FROM transactions WHERE transaction_id = ?', [id], (err) => {
        if (err) {
            console.error('Error deleting transaction:', err);
            return res.status(500).send('Server Error');
        }
        res.redirect('/transactions');
    });
});

// Report page (protected)
router.get('/report', redirectLogin, function (req, res) {
    res.render('report.ejs', { user: req.session.user });
});

// Search page (protected)
router.get('/search', redirectLogin, function (req, res) {
    res.render('search.ejs', { user: req.session.user });
});

// Export the router
module.exports = router;
