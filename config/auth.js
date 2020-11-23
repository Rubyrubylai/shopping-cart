module.exports = {
  authenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      
      return next()
    }
    req.flash('failure_msg', 'The email or password is incorrect.')
    return res.redirect('/user/login')
  },

  adminAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      if (req.user.role === 'admin') {
        return next()
      }
      else {
        req.flash('failure_msg', 'It is not the admin account.')
        return res.redirect('/user/login')
      }
    }
    req.flash('failure_msg', 'The email or password is incorrect.')
    return res.redirect('/user/login')
  }
}