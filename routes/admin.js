const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const adminController = require('../controllers/adminController')
const multer= require('multer')
const upload = multer({ dest: 'temp/' })
const auth = require('../config/auth')

router.get('/', auth.adminAuthenticated, (req, res) => { return res.redirect('/admin/products')})

router.get('/products', auth.adminAuthenticated, adminController.getProducts)
router.get('/newProduct', auth.adminAuthenticated, adminController.getNewProduct)
router.post('/newProduct', auth.adminAuthenticated, upload.single('image'), adminController.postProduct)
router.get('/product/:id', auth.adminAuthenticated, adminController.editProduct)
router.put('/product/:id', auth.adminAuthenticated, upload.single('image'), adminController.putProduct)
router.delete('/product/:id', auth.adminAuthenticated, adminController.removeProduct)

router.get('/orders', auth.adminAuthenticated, adminController.getOrders)
router.get('/orders/:id', auth.adminAuthenticated, adminController.getOrder)
router.put('/orders/:id', auth.adminAuthenticated, adminController.putOrder)

router.get('/categories', auth.adminAuthenticated, adminController.getCategories)
router.post('/category', auth.adminAuthenticated, adminController.postCategory)
router.get('/category/:id', auth.adminAuthenticated, adminController.getCategories)
router.put('/category/:id', auth.adminAuthenticated, adminController.putCategory)
router.delete('/category/:id', auth.adminAuthenticated, adminController.removeCategory)

module.exports = router