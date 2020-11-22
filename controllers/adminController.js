const db = require('../models')
const Product = db.Product
const Order = db.Order
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

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
  },

  getNewProduct: (req, res) => {
    let newProduct = true
    return res.render('admin/product', { newProduct })
  },

  postProduct: (req, res) => {
    const { file } = req
    const { name, price, description } = req.body
    if (!name || !price || !description || !file) {
      req.flash('warning_msg', 'All fields are required!')
      return res.redirect('/admin/products/new')
    }
    else {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return Product.create({
          name,
          price,
          description,
          image: file ? img.data.link : null
        }).then(product => {
          return res.redirect('/admin/products')
        })
      })
    }
  },

  editProduct: (req, res) => {
    Product.findByPk(req.params.id)
    .then(product => {
      return res.render('admin/product', { product: product.toJSON() })
    })
  },

  putProduct: (req, res) => {

  }
}

module.exports = adminController