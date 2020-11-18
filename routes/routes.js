const express = require('express')
const router = express.Router()
const productController = require('../controllers/productController')
const cartController = require('../controllers/cartController')
const orderController = require('../controllers/orderController')

router.get('/', (req, res) => { return res.redirect('/product')})

router.get('/product', productController.getProducts)
router.get('/product/:id', productController.getProduct)

router.get('/cart', cartController.getCart)
router.post('/cart/:id', cartController.postCart)

router.post('/cartItem/:id/add', cartController.addCartItem)
router.post('/cartItem/:id/min', cartController.minCartItem)
router.delete('/cartItem', cartController.removeCartItem)

router.get('/orders', orderController.getOrders)

module.exports = router