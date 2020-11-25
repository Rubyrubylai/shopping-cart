const db = require('../models')
const Product = db.Product
const Cart = db.Cart
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
      Cart.findByPk(
        req.session.cartId,
        { include: [{ model: Product, as: 'items' }] }
        )
      .then(cart => {     
        let noItems
        let items
        let totalPrice = 0
        items = rightCartItem(cart)
        if (!items || (items.length === 0)) {
          noItems = true
        }
        else {
          totalPrice = rightCartPrice(items, totalPrice)
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
        items = rightCartItem(cart)
        if (!items || (items.length === 0)) {
          noItems = true
        }
        else {
          totalPrice = rightCartPrice(items, totalPrice)
        }
        return res.render('product', { product: product.toJSON(), items, totalPrice, noItems })
      })
    })
  }
}

//顯示在購物上的商品
function rightCartItem(cart) {
  return items = cart ? cart.dataValues.items.map(item => ({
    ...item.dataValues,
    cartItemId: item.CartItem.dataValues.id,
    quantity: item.CartItem.dataValues.quantity
  })) : null
}

//總計
function rightCartPrice(items, totalPrice) {
  items.forEach(item => {
    totalPrice += item.price * item.quantity
  })
  return totalPrice

}

module.exports = productController