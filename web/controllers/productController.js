const db = require('../models')
const Product = db.Product
const Cart = db.Cart
const Category = db.Category
const Favorite = db.Favorite
const User = db.User
const helpers = require('../_helpers');
const sort = require('../config/sort')

let pageLimit = 16

const productController = {
  getProducts: (req, res) => {
    //篩選分類
    let whereQuery = {}
    let CategoryId
    if (req.query.CategoryId) {
      CategoryId = Number(req.query.CategoryId)
      whereQuery['CategoryId'] = CategoryId
    }

    //現在是第幾頁及要偏移多少資料，以及預設為第1頁
    let currentPage = Number(req.query.page) || 1
    let offset = 0
    //若點選分頁
    if (currentPage) {
      offset = (currentPage - 1) * pageLimit
    }

    Product.findAndCountAll({
      raw: true, 
      nest: true,
      where: whereQuery,
      limit: pageLimit,
      offset: offset,
      order: [ ['createdAt', 'DESC'] ]
    })
    .then(products => {   
      //分頁功能
      let pages = Math.ceil(products.count/pageLimit)
      let page = Array.from({ length: pages }).map((item, index) => index + 1)
      let prev = (currentPage === 1) ? currentPage : currentPage - 1
      let post = (currentPage === pages) ? currentPage : currentPage + 1

      return res.render('products', { products: products.rows, page, prev, post })
    })
  },

  getProduct: (req, res) => {
    Product.findOne({ 
      where: { 
        id: req.params.id
      },
      include: [{ model: User, as: 'FavoritedUsers' }]
    })
    .then(product => {
      return res.render('product', { product: product.toJSON() })
    })
  },

  getCategories: (req, res) => {
    Category.findAll({
      raw: true,
      nest: true
    })
    .then(categories => {
      return res.json({ categories })
    })
  },

  getFavorites: (req, res) => {
    //現在是第幾頁及要偏移多少資料，以及預設為第1頁
    let currentPage = Number(req.query.page) || 1
    let offset = 0

    //若點選分頁
    if (currentPage) {
      offset = (currentPage-1) * pageLimit
    }

    User.findByPk(req.user.id, {
      include: [{ model: Product, as: 'FavoritedProducts' }]
    }).then(user => {
      var FavoritedProducts = user ? user.toJSON().FavoritedProducts : null

      //分頁
      let pages = Math.ceil(FavoritedProducts.length/pageLimit)
      let page = Array.from({ length: pages }).map((item, index) => index + 1)
      let prev = (currentPage === 1) ? currentPage : currentPage - 1
      let post = (currentPage === pages) ? currentPage : currentPage + 1

      //一頁出現的喜愛商品
      FavoritedProducts = FavoritedProducts.slice(offset, offset + pageLimit)      

      return res.render('favorite', { FavoritedProducts, pages, page, prev, post })
    })
  },

  postFavorite: (req, res) => {
    Favorite.create({
      UserId: helpers.getUser(req).id,
      ProductId: req.params.id
    })
    .then(favorite => {
      req.flash('success_msg', 'The product has been added into the wishlist!')
      return res.redirect('back')
    })
  },

  removeFavorite: (req, res) => {
    Favorite.findOne({ where: {
      UserId: helpers.getUser(req).id,
      ProductId: req.params.id
    }})
    .then(favorite => {
      favorite.destroy().then(favorite => {
        req.flash('success_msg', 'The product has been removed from the wishlist!')
        return res.redirect('back')
      })
    })
  }
}

module.exports = productController