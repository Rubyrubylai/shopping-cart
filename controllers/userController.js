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
  }
}

module.exports = userController