const express = require('express')
const router = express.Router()
const productController = require('../controllers/productController')
const cartController = require('../controllers/cartController')
const orderController = require('../controllers/orderController')
const auth = require('../config/auth')

router.get('/', (req, res) => { return res.redirect('/product')})

router.get('/product', productController.getProducts)
router.get('/product/:id', productController.getProduct)

router.get('/cart', cartController.getCart)
router.post('/cart', cartController.updateCart)
router.post('/cart/remove', cartController.removeCart)
router.get('/cart/check', auth.authenticated, cartController.checkCart)
router.post('/cart/:id', cartController.postCart)


router.get('/orders', auth.authenticated, orderController.getOrders)
router.get('/order/:id', auth.authenticated, orderController.getOrder)
router.post('/order', auth.authenticated, orderController.postOrder)
router.post('/order/:id/cancel', auth.authenticated, orderController.cancelOrder)
router.post('/newebpay/callback', orderController.newebpayCallback)

router.get('/favorite', auth.authenticated, productController.getFavorite)
router.post('/favorite/:id', auth.authenticated, productController.postFavorite)
router.delete('/favorite/:id', auth.authenticated, productController.removeFavorite)

module.exports = router