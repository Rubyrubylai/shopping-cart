module.exports = {
  authenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
        return next()   
    }
    return res.redirect('/user/login') 
  },

  adminAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      if (req.user.role === 'admin') {
        return next()
      }
      else {
        req.flash('warning_msg', 'Please log in with admin account.')
        return res.redirect('/user/login')
      }
    }
    return res.redirect('/user/login')
  }
}