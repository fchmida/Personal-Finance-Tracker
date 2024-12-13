const express = require("express");
const router = express.Router();
const { getExchangeRate } = require('../index');  // Import the getExchangeRate function

// Endpoint to get exchange rate between two currencies
router.get('/currency-exchange', async (req, res) => {
    const { baseCurrency, targetCurrency } = req.query;
  
    if (!baseCurrency || !targetCurrency) {
      return res.status(400).send('Both baseCurrency and targetCurrency parameters are required');
    }
  
    try {
      const exchangeRate = await getExchangeRate(baseCurrency, targetCurrency);
      res.json({ exchangeRate });  // Return the exchange rate in the response
    } catch (error) {
      res.status(500).send('Error fetching exchange rate');
    }
  });

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

// GET: Show transactions (with filters)
// Transactions page (protected)
router.get('/transactions', redirectLogin, function (req, res) {
    let { transaction_date, category, amount_range_min, amount_range_max } = req.query;

    // Construct SQL query with optional filters
    let query = `
        SELECT transactions.*, categories.category_name
        FROM transactions
        LEFT JOIN categories ON transactions.category_id = categories.category_id
        WHERE transactions.user_id = ?  -- Filter by current user
    `;
    let queryParams = [req.session.userId];  // Always filter by the logged-in user

    if (transaction_date) {
        query += ` AND transaction_date = ?`;
        queryParams.push(transaction_date);
    }
    if (category) {
        query += ` AND categories.category_name LIKE ?`;
        queryParams.push('%' + category + '%');
    }
    if (amount_range_min) {
        query += ` AND amount >= ?`;
        queryParams.push(amount_range_min);
    }
    if (amount_range_max) {
        query += ` AND amount <= ?`;
        queryParams.push(amount_range_max);
    }

    db.query(query, queryParams, (err, results) => {
        if (err) {
            console.error('Error fetching transactions', err);
            return res.status(500).send('Server Error');
        }
        res.render('transactions.ejs', { transactions: results });
    });
});

// Add transaction (protected)
router.post('/transactions/add', redirectLogin, function (req, res) {
    const { description, amount, type, category_id, transaction_date } = req.body;
    
    if (!['income', 'expense'].includes(type)) {
        return res.status(400).send('Invalid transaction type');
    }
    // Insert new transaction
    const sql = `
        INSERT INTO transactions (description, amount, type, category_id, user_id, transaction_date)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    const userId = req.session.userId; // Use the user ID from the session

    db.query(sql, [description, amount, type, category_id || null, userId, transaction_date], (err) => {
        if (err) {
            console.error('Error adding transaction:', err);
            return res.status(500).send('Server Error');
        }

        // Redirect to the transactions page after adding
        res.redirect('/transactions');
    });
});

// POST: Delete a transaction
router.post('/transactions/delete/:transaction_id', redirectLogin, function (req, res) {
    const transactionId = req.params.transaction_id;

    // Delete the transaction from the database
    const sql = 'DELETE FROM transactions WHERE transaction_id = ? AND user_id = ?';
    db.query(sql, [transactionId, req.session.userId], (err) => {
        if (err) {
            console.error('Error deleting transaction:', err);
            return res.status(500).send('Server Error');
        }

        // Redirect back to the transactions page after deleting
        res.redirect('/transactions');
    });
});

// Edit transaction route (GET)
router.get('/transactions/edit/:transaction_id', redirectLogin, function (req, res) {
    const transactionId = req.params.transaction_id;

    // Fetch the transaction details to pre-fill the form (not used in this example but could be useful in GET)
    const sql = 'SELECT * FROM transactions WHERE transaction_id = ? AND user_id = ?';
    db.query(sql, [transactionId, req.session.userId], (err, results) => {
        if (err || results.length === 0) {
            return res.status(404).send('Transaction not found');
        }
        const transaction = results[0];
        res.render('editTransaction.ejs', { transaction });
    });
});

// Edit transaction route (POST)
router.post('/transactions/edit/:transaction_id', redirectLogin, function (req, res) {
    const transactionId = req.params.transaction_id;
    const { description, amount, type } = req.body;

    // Ensure the type is valid (optional validation)
    if (!['income', 'expense'].includes(type)) {
        return res.status(400).send('Invalid transaction type');
    }

    // SQL to update the transaction in the database
    const sql = `
        UPDATE transactions
        SET description = ?, amount = ?, type = ?
        WHERE transaction_id = ? AND user_id = ?
    `;

    db.query(sql, [description, amount, type, transactionId, req.session.userId], (err) => {
        if (err) {
            console.error('Error updating transaction:', err);
            return res.status(500).send('Server Error');
        }

        // After update, redirect back to the transactions page
        res.redirect('/transactions');
    });
});


// Report page (protected)
router.get('/report', redirectLogin, function (req, res) {
    const userId = req.session.userId;  // Retrieve the logged-in user's ID from the session

    // SQL query to calculate total income and total expense
    const totalsQuery = `
        SELECT 
            SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS total_income,
            SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS total_expense
        FROM transactions
        WHERE user_id = ?
    `;

    db.query(totalsQuery, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching totals:', err);
            return res.status(500).send('Server Error');
        }

        // Ensure totalIncome and totalExpense are numbers and default to 0 if null or undefined
        const totalIncome = parseFloat(results[0]?.total_income) || 0;
        const totalExpense = parseFloat(results[0]?.total_expense) || 0;

        // Pass total income and expense to the view
        res.render('report.ejs', { totalIncome, totalExpense });
    });
});




// Search page (protected)
router.get('/transactions/search', redirectLogin, (req, res) => {
    const query = req.query.query; // Get the search term from the query string

    // Start building the SQL query
    let sql = `
        SELECT transactions.*, categories.category_name
        FROM transactions
        LEFT JOIN categories ON transactions.category_id = categories.category_id
        WHERE transactions.user_id = ?`;

    let sqlParams = [req.session.userId]; // Always filter by the logged-in user

    // If there's a search term, filter by description or amount
    if (query) {
        sql += ` AND (transactions.description LIKE ? OR transactions.amount LIKE ?)`;
        sqlParams.push(`%${query}%`, `%${query}%`); // Add the search term to the query parameters
    }

    // Execute the query
    db.query(sql, sqlParams, (err, results) => {
        if (err) {
            console.error('Error fetching transactions:', err);
            return res.status(500).send('Server Error');
        }

        // Render the transactions page with the search results
        res.render('transactions.ejs', { transactions: results });
    });
});



// Export the router
module.exports = router;
