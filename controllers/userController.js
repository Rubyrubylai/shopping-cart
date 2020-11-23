const userController = {
  getAccount: (req, res) => {
    res.render('user/account')
  },

  loginPage: (req, res) => {
    res.render('user/login')
  },

  registerPage: (req, res) => {
    res.render('user/register')
  }
}

module.exports = userController