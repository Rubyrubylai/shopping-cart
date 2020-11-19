const db = require('../models')
const Order = db.Order
const Payment = db.Payment
const Product = db.Product
const Cart = db.Cart
const OrderItem = db.OrderItem

const orderController = {
  getOrders: (req, res) => {
    Order.findAll({ include: [ Payment ]})
    .then(orders => { 
      return res.render('orders', { orders })
    })
  },

  getOrder: (req, res) => {
    Order.findByPk(
      req.params.id, 
      { include: [{ model: Product, as: 'items' }, Payment]}
    )
    .then(order => {
      items = order.dataValues.items.map(item => ({
        ...item.dataValues,
        quantity: item.dataValues.OrderItem.dataValues.quantity
      }))
      let totalPrice = 0
      let totalQty = 0
      if (items) {
        items.forEach(item => {
          totalPrice += item.price * item.quantity
        })
        items.forEach(item => {
          totalQty += item.quantity
        })
      }
      return res.render('order', { order: order.toJSON(), items, totalPrice, totalQty })
    })
  },

  postOrder: (req, res) => {
    Cart.findByPk(req.body.cartId, {
      include: [{ model: Product, as: 'items' }]
    })
    .then(cart => {
      const { name, phone, address, amount } = req.body
      Order.create({
        name,
        phone,
        address,
        amount
      })
      .then(order => {
        cart.dataValues.items.forEach(items => {
          OrderItem.create({
            price: items.dataValues.price,
            quantity: items.dataValues.CartItem.quantity,
            ProductId: items.dataValues.id,
            OrderId: order.id
          })
          .then(orderItem => {
            return res.redirect(`/orders/${order.id}`)
          })
        })
        
      })
    })
  }
}

module.exports = orderController