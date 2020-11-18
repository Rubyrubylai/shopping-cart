const db = require('../models')
const CartItem = db.CartItem
const Cart = db.Cart

const cartController = {
  getCart: (req, res) => {
    res.render('cart')
  },

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
            req.flash('success_msg', '此商品已經成功加入購物車!')
            return res.redirect('back')
          })
        })
        .catch(err => console.error(err))
      })  
    })
  }
}

module.exports = cartController