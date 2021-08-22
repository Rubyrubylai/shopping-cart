const express = require('express')
const router = express.Router()
const productController = require('../controllers/productController')
const cartController = require('../controllers/cartController')
const orderController = require('../controllers/orderController')
const auth = require('../config/auth')

router.get('/', (req, res) => { return res.redirect('/products')})

router.get('/products', productController.getProducts)
router.get('/product/:id', productController.getProduct)

router.get('/cart', cartController.getCart)
router.put('/cart', cartController.updateCart)
router.delete('/cart', cartController.removeCart)
router.get('/cart/check', auth.authenticated, cartController.checkCart)
router.post('/cart/:id', cartController.postCart)
router.get('/rightCart', cartController.getRightCart)

router.get('/orders', auth.authenticated, orderController.getOrders)
router.get('/order/:id', auth.authenticated, orderController.getOrder)
router.post('/order', auth.authenticated, orderController.postOrder)
router.delete('/order/:id', auth.authenticated, orderController.cancelOrder)
router.post('/newebpay/callback', orderController.newebpayCallback)

router.get('/favorites', auth.authenticated, productController.getFavorites)
router.post('/favorite/:id', auth.authenticated, productController.postFavorite)
router.delete('/favorite/:id', auth.authenticated, productController.removeFavorite)

module.exports = router