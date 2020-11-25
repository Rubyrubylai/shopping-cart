const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
var cookieParser = require('cookie-parser')
const session = require('express-session')
const flash = require('connect-flash')
require('dotenv').config()
const passport = require('passport')

const app = express()
const port = 3000

app.engine('hbs', exphbs({
  extname: '.hbs', 
  defaultLayout: 'main',
  helpers: require('./config/handlebars-helpers')
}))
app.set('view engine', 'hbs')

app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended: true }))

app.use(methodOverride('_method'))

app.use(cookieParser())
app.use(session({
  secret: 'ac',
    name: 'ac',
    cookie: { maxAge: 80000 },
    resave: false,
    saveUninitialized: true,
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  res.locals.failure_msg = req.flash('failure_msg')
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  next()
})

app.use('/upload', express.static(__dirname + '/upload'))

require('./routes')(app)

app.listen(port, () => {
  console.log(`app is running on http://localhost:${port}`)
})

