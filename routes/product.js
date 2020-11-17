const express = require('express')
const router = express.Router()
const productContoller = require('../controllers/productController')

router.get('/', productContoller.getProducts)
router.get('/:id', productContoller.getProduct)

module.exports = router