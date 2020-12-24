const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const auth = require('../config/auth')

router.get('/login', userController.loginPage)
router.post('/login', userController.login)
router.post('/logout', userController.logout)

router.get('/register', userController.registerPage)
router.post('/register', userController.register)

router.get('/account', auth.authenticated, userController.getAccount)
router.put('/account', auth.authenticated, userController.putAccount)

module.exports = router