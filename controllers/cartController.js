const db = require('../models')
const CartItem = db.CartItem
const Cart = db.Cart

const cartController = {
  getCart: (req, res) => {
    res.render('cart')
  },

  postCart: (req, res) => {
    Cart.create()
    .then(cart => {
      CartItem.create({
        quantity: req.body.num,
        ProductId: req.params.id,
        CartId: cart.id
      })
      .then(cartItem => {
        console.log(cartItem)
        return res.redirect(`/product/${req.params.id}`)
      })
    })
  }
}

module.exports = cartController