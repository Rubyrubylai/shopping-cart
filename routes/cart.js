const express = require('express')
const router = express.Router()
const cartController = require('../controllers/cartController')

router.get('/', cartController.getCart)
router.post('/:id', cartController.postCart)
router.delete('/', cartController.removeCart)

module.exports = router