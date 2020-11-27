const db = require('../models')
const User = db.User
const Category = db.Category
const bcrypt = require('bcrypt')

const userController = {
  getAccount: (req, res) => {
    User.findByPk(req.user.id)
    .then(user => {
      //上方導覽列的分類
      Category.findAll({
        raw: true,
        nest: true
      })
      .then(categories => {
        return res.render('user/account', { user: user.toJSON(), categories })
      })
    })
  },

  putAccount: (req, res) => {
    User.findByPk(req.user.id)
    .then(user => {
      const { name, email, account, address, phone, oldPassword, newPassword, confirmPassword } = req.body
      let errors = []
      //如果有輸入到密碼欄位
      if (oldPassword || newPassword || confirmPassword) {
        if (!bcrypt.compareSync(oldPassword, user.password)) {
          errors.push({ error_msg: 'The old password is incorrect. Please enter again.' })
        }
        if(!newPassword || !confirmPassword || !oldPassword) {
          errors.push({ error_msg: 'Please fill in all password fields.' })
        }
        if (newPassword !== confirmPassword) {
          errors.push({ error_msg: 'The new password does not match with the confirmed one. Please enter again.' })
        }
        if (oldPassword === newPassword) {
          errors.push({ error_msg: 'The new password cannot be the same as the old one. Please enter again.' })
        }
        if (!email) {
          errors.push({ error_msg: 'The email field is required.' })
        }
        if (errors.length > 0) {
          //上方導覽列的分類
          Category.findAll({
            raw: true,
            nest: true
          })
          .then(categories => {
            return res.render('user/account', { user: { name, email, account, address, phone }, errors, categories })
          })
        }
        else{  
          user.update({
            name,
            email,
            account,
            address,
            phone,
            password: bcrypt.hashSync(newPassword, bcrypt.genSaltSync(10))
          })
          .then(user => {
            req.flash('success_msg', 'The account is updated successfully.')
            return res.redirect('/user/account')
          })
        }
      }
      else if (!email) {
        req.flash('warning_msg', 'The email field is required.')
        return res.redirect('back')
      }
      else {
        user.update({
          name,
          email,
          account,
          address,
          phone
        })
        .then(user => {
          req.flash('success_msg', 'The account is updated successfully.')
          return res.redirect('/user/account')
        })
      }
    })
  },

  loginPage: (req, res) => {
    //上方導覽列的分類
    Category.findAll({
      raw: true,
      nest: true
    })
    .then(categories => {
      return res.render('user/login', { categories })
    })
  },

  registerPage: (req, res) => {
    //上方導覽列的分類
    Category.findAll({
      raw: true,
      nest: true
    })
    .then(categories => {
      return res.render('user/register', { categories })
    })
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
      //上方導覽列的分類
      Category.findAll({
        raw: true,
        nest: true
      })
      .then(categories => {
        return res.render('user/register', { errors, account, email, password, confirmPassword, categories })
      })
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
  },

  logout: (req, res) => {
    req.logout()
    req.flash('success_msg', 'Log out successfully. Please log in again.')
    return res.redirect('/user/login')
  }
}

module.exports = userController