const db = require('../models')
const CartItem = db.CartItem
const Cart = db.Cart
const Product = db.Product

const cartController = {
  getCart: (req, res) => {
    Cart.findByPk(
      req.session.cartId,
      { include: [{ model: Product, as: 'items' }] }
      )
    .then(cart => { 
      let noItems
      let items
      let totalPrice = 0
      let totalQty = 0
      items = rightCartItem(cart)
      if (!items || (items.length === 0)) {
        noItems = true
      }
      else {
        totalPrice = rightCartPrice(items, totalPrice)
        items.forEach(item => {
          totalQty += item.quantity
        })
      }
    
      return res.render('cart', { cart, items, totalPrice, totalQty, noItems })
    })
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
            req.flash('success_msg', 'The item has been successfully added!')
            return res.redirect('back')
          })
        })
        .catch(err => console.error(err))
      })  
    })
  },

  removeCartItem: (req, res) => {
    CartItem.findByPk(req.body.cartItemId)
    .then(cartItem => {
      cartItem.destroy().then(cartItem => {
        req.flash('success_msg', 'The item has been successfully removed!')
        return res.redirect('back')
      })
      
    })
  },

  addCartItem: (req, res) => {
    CartItem.findByPk(req.params.id)
    .then(cartItem => {
      cartItem.update({
        quantity: cartItem.quantity + 1
      })
      .then(cartItem => {
        return res.redirect('back')
      })
    })
  },

  minCartItem: (req, res) => {
    CartItem.findByPk(req.params.id)
    .then(cartItem => {
      cartItem.update({
        quantity: (cartItem.quantity = 1) ? 1 : cartItem.quantity
      })
      .then(cartItem => {
        return res.redirect('back')
      })
    })
  },

  checkCart: (req, res) => {
    //購物車
    Cart.findByPk(
      req.session.cartId,
      { include: [{ model: Product, as: 'items' }] }
      )
    .then(cart => { 
      let items
      let totalPrice = 0
      let totalQty = 0
      items = rightCartItem(cart)
      if (items) {
        totalPrice = rightCartPrice(items, totalPrice)
        items.forEach(item => {
          totalQty += item.quantity
        })
      }

      return res.render('check', { cart, items, totalPrice, totalQty })
    })
  }
}

//顯示在購物上的商品
function rightCartItem(cart) {
  return items = cart ? cart.dataValues.items.map(item => ({
    ...item.dataValues,
    cartItemId: item.CartItem.dataValues.id,
    quantity: item.CartItem.dataValues.quantity,
    subtotalPrice: item.CartItem.dataValues.quantity * item.dataValues.price, 
  })) : null
}

//總計
function rightCartPrice(items, totalPrice) {
  items.forEach(item => {
    totalPrice += item.price * item.quantity
  })
  return totalPrice
}

module.exports = cartController