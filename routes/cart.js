
const db = require('../models')
const CartItem = db.CartItem

module.exports = (app) => {
  app.post('/cart', (req, res) => {
    CartItem.findByPk(req.body.cartItemId)
    .then(cartItem => {
      cartItem.update({
        quantity: req.body.num
      })
      .then(cartItem => {
        return res.redirect('back')
      })
    })
  }),

  app.post('/cart/remove', (req, res) => {
    CartItem.findByPk(req.body.cartItemId)
    .then(cartItem => {
      cartItem.destroy().then(cartItem => {
        return res.redirect('back')
      })
      
    })
  })
}