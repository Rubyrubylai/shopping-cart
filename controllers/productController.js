const db = require('../models')
const Product = db.Product
const CartItem = db.CartItem

const productController = {
  getProducts: (req, res) => {
    //每頁幾個商品及偏移多少
    let pageLimit = 8
    let offset = 0
    let currentPage = req.query.page
    if (currentPage) {
      offset = (currentPage - 1) * pageLimit
    }
   
    Product.findAndCountAll({
      raw: true, 
      nest: true,
      limit: pageLimit,
      offset: offset
    })
    .then(products => {
      //頁數
      let pages = Math.ceil(products.count/pageLimit)
      let page = Array.from({ length: pages }).map((item, index) => index + 1)
      let prev = (currentPage = 1) ? currentPage : currentPage - 1
      let post = (currentPage = pages) ? currentPage : currentPage + 1

      //購物車
      CartItem.findAll({
        raw: true,
        nest: true
      })
      .then(cartItems => {
        return res.render('products', { products: products.rows, page, prev, post, cartItems })
      })
      
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

module.exports = productController