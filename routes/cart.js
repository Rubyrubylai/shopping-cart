
const db = require('../models')
const CartItem = db.CartItem

module.exports = (app) => {
  app.post('/cart', (req, res) => {
    CartItem.findOne({ where: {
        ProductId: req.body.productId,
        CartId: req.body.cartId
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