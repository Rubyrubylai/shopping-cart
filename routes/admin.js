const express = require('express')
const router = express.Router()
const adminController = require('../controllers/adminController')
const multer= require('multer')
const upload = multer({ dest: 'temp/' })

router.get('/', (req, res) => { return res.redirect('/admin/products')})

router.get('/products', adminController.getProducts)
router.get('/products/new', adminController.getNewProduct)
router.post('/products/new', upload.single('image'), adminController.postProduct)
router.get('/products/:id', adminController.editProduct)
router.put('/products/:id', upload.single('image'), adminController.putProduct)
router.delete('/products/:id', adminController.removeProduct)

router.get('/orders', adminController.getOrders)
router.get('/orders/:id', adminController.editOrder)
router.put('/orders/:id', adminController.putOrder)

module.exports = router