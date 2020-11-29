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
    cookie: { maxAge: null },
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

const db = require('./models')
const Favorite = db.Favorite
const Cart = db.Cart
const CartItem = db.CartItem
const auth = require('./config/auth')

app.post('/favorite', auth.authenticated, (req, res) => {
  console.log(req.body.productId)
  Favorite.create({
    UserId: req.user.id,
    ProductId: req.body.productId
  })
  // .then(favorite => {
    //console.log(favorite)
    // req.flash('success_msg', 'The product has been added into the wishlist!')
    // return res.redirect('back')
  // })
})

app.post('/cart', (req, res) => {
  console.log('------------')
  console.log(req.body.cartId)
  console.log(req.body.productId)
  CartItem.findOne({ where: {
      ProductId: Number(req.body.productId),
      CartId: Number(req.body.cartId)
    }
  })
  .then(cartItem => {
    cartItem.update({
      quantity: req.body.num
    })
    .then(cartItem => {
      return res.redirect('back')
    })
  })
})

// app.post('/cart', (req, res) => {
  
//   Cart.findOrCreate({
//     where: { id: req.body.cartId || 0 }
//   })
//   .spread((cart, created) => {
    
//     CartItem.findOrCreate({
//       where: {
//         CartId: cart.id,
//         ProductId: req.body.productId
//       },
//       default: {
//         CartId: cart.id,
//         ProductId: req.body.productId
//       }
//     })
//     .spread((cartItem, created) => {
//       cartItem.update({
//         quantity: Number(cartItem.quantity || 0)  + Number(req.body.num)
//       })
//       .then(cartItem => {
//         console.log(req.body.cartId)
//         let items
//         let totalPrice = 0
        
//         items = sort.rightCartItem(cart)
//         if (!items || (items.length === 0)) {
//           noItems = true
//         }
//         else {
//           totalPrice = sort.rightCartPrice(items, totalPrice)
//         }
//         console.log(cartItem.toJSON())
//         req.session.cartId = cart.id
//         var cartId = req.session.cartId
//         return req.session.save(() => {
//           console.log('------------------POST')
//           console.log(cart)
//           req.flash('success_msg', 'The item has been added into the cart!')
//           console.log(req.session.cartId)
//           Product.findByPk(req.params.id)
//           .then(product => {
//             return res.render('product', { cartId })
//           })
          
//         })
//       })
//       .catch(err => console.error(err))
//     })  
//   })
// })

require('./routes')(app)

app.listen(port, () => {
  console.log(`app is running on http://localhost:${port}`)
})

