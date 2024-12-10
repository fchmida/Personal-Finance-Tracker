// Create a new router
const express = require("express")
const router = express.Router()
const bodyParser = require('body-parser');
const userRoutes = require('./users'); //path to user.js

const app = express();

// Middleware for parsing form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//mount routes with base path
app.use('./users', userRoutes);

// Handle our routes
router.get('/',function(req, res, next){
    res.render('index.ejs')
})

router.get('/about',function(req, res, next){
    res.render('about.ejs')
})

router.get('/dashboard',function(req, res, next){
    res.render('dashboard.ejs')
})

//display transactions page
router.get('/transactions', (req, res) => {
   db.query('SELECT * FROM transactions', (err, results) => {
    if (err) {
        console.error('Error fetching transactions', err);
        return res.status(500).send('Server Error');
    }
    res.render('transactions.ejs', { transactions: results });
   });
});

//add transaction
router.post('/transaction/add', (req, res) => {
        const { description, amount, type } = req.body;
        //insert new transaction into db
        db.query(
            'INSERT INTO transactions (description, amount, type) VALUES (?, ?, ?)',
            [description, amount, type],
            (err) => {
                if (err) {
                console.error('Error adding transaction:', err);
                return res.status(500).send('Server Error');
            }
            res.redirect('/transactions');
    });
});

//edit transaction
router.get('/transactions/edit/:id', (req, res) => {
    const transactionId =req.params.id;
    db.query('SELECT * FROM transactions WHERE transactions_id = ?', [transactionId], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error fetching transaction');
        } else {
            res.render('edit-transaction', { transaction: results[0] });
        }
    })
})

//post route for submitting edit form 
router.post('/transaction/edit/:id', (req, res) => {
        const {id} = req.params;
        const {description, amount, type} = req.body;
        //update specified transaction in db
        db.query(
            'UPDATE transactions SET description = ?, amount = ?, type = ? WHERE transcation_id = ?',
            [description, amount, type, id],
            (err) => {
                if (err) {
                console.error('Error updating transaction:', err);
                return res.status(500).send('Server Error');
            }
            res.redirect('/transactions');
    });
});


//delete transcation
router.post('/transcations/delete/:id', (req, res) => {
        const {id} = req.params;
        //delete specified transaction from db
        db.query('DELETE FROM transactions WHERE transaction_id = ?', [id]);
        if (err) {
                console.error('Error deleting transaction:', err);
                return res.status(500).send('Server Error');
          }
          res.redirect('/transactions');
});

// router.get('/transactions/edit/:id', (req, res) => {
//     const transactionId = req.params.id;
//     // Fetch transaction details and pass to the view
//     res.render('edit-transactions', { transactionId });
// });

router.get('/report',function(req, res, next){
    res.render('report.ejs')
})

router.get('/search',function(req, res, next){
    res.render('search.ejs')
})
// Export the router object so index.js can access it
module.exports = router