const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const userController = require('../controllers/userController')
const auth = require('../config/auth')

router.get('/login', userController.loginPage)
router.post('/login', passport.authenticate('local', { 
  failureRedirect: '/user/login' }), userController.login)

router.get('/register', userController.registerPage)
router.post('/register', userController.register)

router.get('/account', auth.authenticated, userController.getAccount)

module.exports = router