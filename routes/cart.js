const express = require('express')
const router = express.Router()
const cartController = require('../controllers/cartController')


router.post('/:id', cartController.postCart)
router.delete('/', cartController.removeCart)
//router.get('/', cartController.getCart)

module.exports = router