const db = require('../models')
const Product = db.Product

adminController = {
  getProducts: (req, res) => {
    Product.findAll({
      raw: true,
      nest: true
    })
    .then(products => {
      return res.render('admin/products', { products })
    })
  }
}

module.exports = adminController