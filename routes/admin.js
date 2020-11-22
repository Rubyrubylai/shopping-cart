const express = require('express')
const router = express.Router()
const adminController = require('../controllers/adminController')

router.get('/', (req, res) => { return res.redirect('/admin/products')})

router.get('/products', adminController.getProducts)

module.exports = router