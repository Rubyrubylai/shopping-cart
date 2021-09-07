const helpers = require('../_helpers');

module.exports = {
  authenticated: (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {  
      return next()   
    }

    const redirect = req.query.redirect
    return res.redirect(`/user/login?redirect=${redirect}`) 
  },

  adminAuthenticated: (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      if (helpers.getUser(req).role === 'admin') {
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