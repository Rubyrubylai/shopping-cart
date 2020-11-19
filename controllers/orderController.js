const db = require('../models')
const Order = db.Order
const Payment = db.Payment
const Product = db.Product

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
      console.log(order.toJSON())
      items = order.dataValues.items.map(item => ({
        ...item.dataValues,
        quantity: item.dataValues.OrderItem.dataValues.quantity
      }))
      console.log('----------------------------')
      console.log(items)
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
    
  }
}

module.exports = orderController