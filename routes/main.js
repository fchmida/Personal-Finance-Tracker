// Create a new router
const express = require("express")
const router = express.Router()

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

router.get('/transactions',function(req, res, next){
    res.render('transactions.ejs')
})

router.get('/transcations/add',function(req, res, next){
    res.render('add-transactions.ejs')
})

router.get('/transcations/delete',function(req, res, next){
    res.render('delete-transactions.ejs')
})

router.get('/transactions/edit/:id', (req, res) => {
    const transactionId = req.params.id;
    // Fetch transaction details and pass to the view
    res.render('edit-transactions', { transactionId });
});

router.get('/report',function(req, res, next){
    res.render('report.ejs')
})

router.get('/search',function(req, res, next){
    res.render('search.ejs')
})
// Export the router object so index.js can access it
module.exports = router