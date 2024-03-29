const db = require('../models')
const CartItem = db.CartItem
const Cart = db.Cart
const Product = db.Product
const User = db.User
const Category = db.Category

const sort = require('../config/sort')

const cartController = {
  getCart: (req, res) => {
    Cart.findByPk(
      req.session.cartId,
      { include: [{ model: Product, as: 'items' }] }
      )
    .then(cart => { 
      let totalPrice = 0
      let totalQty = 0
      let items = sort.rightCartItem(cart)
      let noItems = false
      if (!items || (items.length === 0)) {
        noItems = true
      }
      else {
        totalPrice = sort.rightCartPrice(items, totalPrice)
        items.forEach(item => {
          totalQty += item.quantity
        })
      }

      return res.render('cart', { cart, items, totalPrice, totalQty, noItems })
    })
  },

  getRightCart: (req, res) => {
    Cart.findByPk(
      req.session.cartId,
      { include: [{ model: Product, as: 'items' }] }
      )
    .then(cart => { 
      let totalPrice = 0
      let totalQty = 0
      let items = sort.rightCartItem(cart)
      let noItems = false
      if (!items || (items.length === 0)) {
        noItems = true
      }
      else {
        totalPrice = sort.rightCartPrice(items, totalPrice)
        items.forEach(item => {
          totalQty += item.quantity
        })
      }

      return res.json({ cart, items, totalPrice, totalQty, noItems })
    })
  },

  //將商品加入購物車
  postCart: (req, res) => {
    Cart.findOrCreate({
      where: { id: req.session.cartId || 0 }
    })
    .spread((cart, created) => {
      CartItem.findOrCreate({
        where: {
          CartId: cart.id,
          ProductId: req.params.id
        },
        default: {
          CartId: cart.id,
          ProductId: req.params.id
        }
      })
      .spread((cartItem, created) => {
        cartItem.update({
          quantity: Number(cartItem.quantity || 0)  + Number(req.body.num)
        })
        .then(cartItem => {
          req.session.cartId = cart.id
          return req.session.save(() => {
            req.flash('success_msg', 'The item has been added into the cart!')
            return res.redirect('back')            
          })
        })
        .catch(err => console.error(err))
      })  
    })
  },

  //確認訂單
  checkCart: (req, res) => {
    Cart.findByPk(
      req.session.cartId,
      { include: [{ model: Product, as: 'items' }] }
      )
    .then(cart => {
      let totalPrice = 0
      let totalQty = 0
      let items = sort.rightCartItem(cart)
      if (items) {
        totalPrice = sort.rightCartPrice(items, totalPrice)
        items.forEach(item => {
          totalQty += item.quantity
        })
      }

      User.findByPk(req.user.id)
      .then(user => {
        return res.render('check', { cart, items, totalPrice, totalQty, user: user.toJSON() })
      }) 
    })
  },

  updateCart:  (req, res) => {
    CartItem.findByPk(req.body.cartItemId)
    .then(cartItem => {
      cartItem.update({
        quantity: req.body.num
      })
      .then(cartItem => {
        return res.send('update cart')
      })
    })
  },

  removeCart: (req, res) => {
    CartItem.findByPk(req.body.cartItemId)
    .then(cartItem => {
      cartItem.destroy().then(cartItem => {
        return res.send('delete cart')
      })
    })
  }
}

module.exports = cartController