const db = require('../models')
const Product = db.Product
const Order = db.Order

adminController = {
  getProducts: (req, res) => {
    Product.findAll({
      raw: true,
      nest: true
    })
    .then(products => {
      return res.render('admin/products', { products })
    })
  },

  getOrders: (req, res) => {
    Order.findAll({
      raw: true,
      nest: true
    })
    .then(orders => {
      return res.render('admin/orders', { orders })
    })

  }
}

module.exports = adminController