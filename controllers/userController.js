const db = require('../models')
const User = db.User
const bcrypt = require('bcrypt')

const userController = {
  getAccount: (req, res) => {
    res.render('user/account')
  },

  loginPage: (req, res) => {
    res.render('user/login')
  },

  registerPage: (req, res) => {
    res.render('user/register')
  },

  login: (req, res) => {
    return res.redirect('/')
  },

  register: (req, res) => {
    let errors = []
    const { account, email, password, confirmPassword } = req.body
    if (!account || !email || !password || !confirmPassword) {
      errors.push({ error_msg: 'All fields are required!' })
    }
    if (password !== confirmPassword) {
      errors.push({ error_msg: 'Passwords are not matched!' })
    }
    if (errors.length > 0) {
      return res.render('user/register', { errors, account, email, password, confirmPassword })
    }
    else {
      User.findOne({ where: { email: email} })
      .then(user => {
        if (user) {
          req.flash('warning_msg', 'The email is already existed. Please log in directly.')
          return res.redirect('back')
        }
        else {
          User.create({
            account,
            email,
            password:  bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
            role: 'customer'
          })
          .then(user => {
            req.flash('success_msg', 'Register successfully. Please log in.')
            return res.redirect('/user/login')
          })
        }
      })
    } 
  }
}

module.exports = userController