const passport = require('passport')
const bcrypt = require('bcrypt')
const LocalStrategy = require('passport-local').Strategy
const db = require('../models')
const User = db.User

passport.use(new LocalStrategy({
  usernameField: 'email',
  passReqToCallback: true
},(req, email, password, done) => {
  User.findOne({ where: { email: email }})
  .then(user => {
    if (!user) { 
      return done(null, false, req.flash('failure_msg', 'The email or password is incorrect')) 
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return done(null, false, req.flash('failure_msg', 'The email or password is incorrect'))
    }
    return done(null, user)
  })
}))

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.findByPk(id)
  .then(user => {
    user = user.toJSON()
    return done(null ,user)
  })
})

module.exports = passport