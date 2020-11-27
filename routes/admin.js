const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const adminController = require('../controllers/adminController')
const multer= require('multer')
const upload = multer({ dest: 'temp/' })
const auth = require('../config/auth')

router.get('/', auth.adminAuthenticated, (req, res) => { return res.redirect('/admin/products')})

router.get('/products', auth.adminAuthenticated, adminController.getProducts)
router.get('/products/new', auth.adminAuthenticated, adminController.getNewProduct)
router.post('/products/new', auth.adminAuthenticated, upload.single('image'), adminController.postProduct)
router.get('/products/:id', auth.adminAuthenticated, adminController.editProduct)
router.put('/products/:id', auth.adminAuthenticated, upload.single('image'), adminController.putProduct)
router.delete('/products/:id', auth.adminAuthenticated, adminController.removeProduct)

router.get('/orders', auth.adminAuthenticated, adminController.getOrders)
router.get('/orders/:id', auth.adminAuthenticated, adminController.getOrder)
router.put('/orders/:id', auth.adminAuthenticated, adminController.putOrder)

router.get('/categories', auth.adminAuthenticated, adminController.getCategories)
router.post('/categories/new', auth.adminAuthenticated, adminController.postCategory)
router.get('/categories/:id', auth.adminAuthenticated, adminController.getCategories)
router.put('/categories/:id', auth.adminAuthenticated, adminController.putCategory)
router.delete('/categories/:id', auth.adminAuthenticated, adminController.removeCategory)

module.exports = router