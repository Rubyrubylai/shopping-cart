const db = require('../models')
const Order = db.Order
const Payment = db.Payment

const orderController = {
  getOrders: (req, res) => {
    Order.findAll({ include: [ Payment ]})
    .then(orders => {
     
      return res.render('orders', { orders })
    })
  }
}

module.exports = orderController