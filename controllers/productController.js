const db = require('../models')
const Product = db.Product

const productContoller = {
  getProducts: (req, res) => {
    Product.findAll({
      raw: true,
      nest: true
    })
    .then(products => {
      res.render('products', { products })
    })
  },

  getProduct: (req, res) => {
    Product.findOne({ where: 
      { 
        id: req.params.id
      } 
    })
    .then(product => {
      res.render('product', { product: product.toJSON() })
    })
  }
}

module.exports = productContoller