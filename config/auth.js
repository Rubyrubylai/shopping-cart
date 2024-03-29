module.exports = {
  authenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
        return next()   
    }

    const redirect = req.query.redirect
    return res.redirect(`/user/login?redirect=${redirect}`) 
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