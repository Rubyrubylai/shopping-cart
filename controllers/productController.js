const db = require('../models')
const Product = db.Product
const Cart = db.Cart
const sort = require('../config/sort')

const productController = {
  getProducts: (req, res) => {
    //每頁幾個商品及偏移多少
    let pageLimit = 16
    let offset = 0
    let currentPage = req.query.page
    if (currentPage) {
      offset = (currentPage - 1) * pageLimit
    }

    Product.findAndCountAll({
      raw: true, 
      nest: true,
      limit: pageLimit,
      offset: offset,
      order: [ ['createdAt', 'DESC'] ]
    })
    .then(products => {
      //頁數
      let pages = Math.ceil(products.count/pageLimit)
      let page = Array.from({ length: pages }).map((item, index) => index + 1)
      let prev = (currentPage = 1) ? currentPage : currentPage - 1
      let post = (currentPage = pages) ? currentPage : currentPage + 1

      //購物車
      Cart.findByPk(
        req.session.cartId,
        { include: [{ model: Product, as: 'items' }] }
        )
      .then(cart => {     
        let noItems
        let items
        let totalPrice = 0
        //右側購物車
        items = sort.rightCartItem(cart)
        if (!items || (items.length === 0)) {
          noItems = true
        }
        else {
          totalPrice = sort.rightCartPrice(items, totalPrice)
        }

        return res.render('products', { products: products.rows, page, prev, post, items, totalPrice, noItems })
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
      Cart.findByPk(
        req.session.cartId,
        { include: [{ model: Product, as: 'items' }] }
        )
      .then(cart => {     
        let noItems
        let items
        let totalPrice = 0
        //右側購物車
        items = sort.rightCartItem(cart)
        if (!items || (items.length === 0)) {
          noItems = true
        }
        else {
          totalPrice = sort.rightCartPrice(items, totalPrice)
        }
        return res.render('product', { product: product.toJSON(), items, totalPrice, noItems })
      })
    })
  }
}

module.exports = productController